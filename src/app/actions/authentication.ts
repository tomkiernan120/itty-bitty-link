"use server";

import { signIn } from "@/app/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "@/utils/prisma";
import bcrypt from "bcryptjs";
import z from "zod";

type ActionResult<T = null> =
  | { success: true; data?: T }
  | { success: false; error: string };

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export const handleRegister = async (formdata: FormData): Promise<ActionResult> => {
  try {
    const { name, email, password } = Object.fromEntries(formdata);

    const validation = registerSchema.safeParse({
      name,
      email,
      password
    });

    if (!validation.success) {
      const errorMessage = validation.error.issues[0]?.message || "Validation failed";
      return { success: false, error: errorMessage };
    }

    const passwordHashed = await bcrypt.hash(validation.data.password, 10);
    const normalizedEmail = validation.data.email.trim().toLowerCase();

    await prisma.user.create({
      data: {
        name: validation.data.name,
        email: normalizedEmail,
        password: passwordHashed
      }
    });

    // Auto-login after successful registration
    try {
      await signIn("credentials", {
        email: normalizedEmail,
        password: validation.data.password,
        redirectTo: "/dashboard"
      });
      // signIn with redirectTo throws NEXT_REDIRECT, so we never reach here
      return { success: true };
    } catch (signInError: any) {
      // signIn() with redirectTo will throw NEXT_REDIRECT which should propagate
      if (signInError?.digest) {
        throw signInError;
      }
      return { success: false, error: "Auto-login failed after registration" };
    }
  } catch (error: any) {
    // Let NEXT_REDIRECT propagate
    if (error?.digest) {
      throw error;
    }

    // Handle duplicate email error
    if (error.code === "P2002") {
      return { success: false, error: "An account with this email already exists" };
    }

    return { success: false, error: error.message || "Registration failed" };
  }
};

export const handleLogin = async (formdata: FormData): Promise<ActionResult> => {
  try {
    await signIn("credentials", {
      email: String(formdata.get("email") ?? "").trim().toLowerCase(),
      password: String(formdata.get("password") ?? ""),
      redirectTo: "/dashboard"
    });
    // signIn with redirectTo throws NEXT_REDIRECT, so we never reach here
    return { success: true };
  } catch (error: any) {
    // Let NEXT_REDIRECT propagate
    if (error?.digest) {
      throw error;
    }

    if (error instanceof AuthError && error.type === "CredentialsSignin") {
      return { success: false, error: "Invalid email or password" };
    }

    return { success: false, error: error.message || "Login failed" };
  }
};