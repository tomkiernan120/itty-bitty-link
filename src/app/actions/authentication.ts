"use server";

import { signIn } from "@/app/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "@/utils/prisma";
import bcrypt from "bcryptjs";
import z from "zod";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export const handleRegister = async (formdata: FormData) => {
  try {
    const { name, email, password } = Object.fromEntries(formdata);

    const validation = registerSchema.safeParse({
      name,
      email,
      password
    });

    if (!validation.success) {
      throw new Error(JSON.stringify(validation.error.issues));
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
    } catch (signInError: any) {
      // signIn() with redirectTo will throw NEXT_REDIRECT which should not be caught
      // Re-throw it so the redirect happens
      if (signInError?.digest) {
        throw signInError;
      }
      // Handle other errors
      throw new Error("Auto-login failed after registration");
    }
  } catch (error: any) {
    // Don't catch NEXT_REDIRECT errors
    if (error?.digest) {
      throw error;
    }
    // Handle duplicate email error
    if (error.code === "P2002") {
      throw new Error("An account with this email already exists");
    }
    throw new Error(error.message || "Registration failed");
  }
};

export const handleLogin = async (formdata: FormData) => {
  try {
    await signIn("credentials", {
      email: String(formdata.get("email") ?? "").trim().toLowerCase(),
      password: String(formdata.get("password") ?? ""),
      redirectTo: "/dashboard"
    });
  } catch (error) {
    if (error instanceof AuthError && error.type === "CredentialsSignin") {
      redirect("/login?error=invalid_credentials");
    }

    throw error;
  }
};