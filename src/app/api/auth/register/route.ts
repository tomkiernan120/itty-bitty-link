import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import bcrypt from "bcryptjs";
import z from "zod";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export async function POST(request: NextRequest) {
  try {
    const formdata = await request.formData();
    const { name, email, password } = Object.fromEntries(formdata);

    // Validate form data
    const validation = registerSchema.safeParse({
      name,
      email,
      password
    });

    if (!validation.success) {
      return NextResponse.json(
        { message: JSON.stringify(validation.error.issues) },
        { status: 400 }
      );
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

    return NextResponse.json({ message: "Registration successful" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Registration failed" },
      { status: 500 }
    );
  }
}
