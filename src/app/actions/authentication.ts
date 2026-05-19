import { signIn } from "next-auth/react";
import prisma from "@/utils/prisma";
import bcrypt from "bcryptjs";
import z from "zod";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export const handleRegister = async (formdata: FormData) => {
  "use server";

  try {
    const { name, email, password } = Object.fromEntries(formdata);

    // Validate form data
    const validation = registerSchema.safeParse({
      name,
      email,
      password
    });

    if (!validation.success) {
      throw new Error(JSON.stringify(validation.error.issues));
    }

    const passwordHashed = await bcrypt.hash(validation.data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: validation.data.name,
        email: validation.data.email,
        password: passwordHashed
      }
    });
  } catch (error: any) {
    throw new Error(error.message || "Registration failed");
  }
};

export const handleLogin = async (formdata: FormData) => {
  "use server";
  await signIn("credentials", {
    email: formdata.get("email") as string,
    password: formdata.get("password") as string
  }, {
    redirectTo: "/dashboard"
  });
};