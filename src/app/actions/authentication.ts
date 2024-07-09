import { signIn } from "next-auth/react";
import prisma from "@/utils/prisma";
import bcrypt from "bcryptjs";

export const handleRegister = async (formdata: FormData) => {
  "use server";

  const { name, email, password } = Object.fromEntries(formdata);

  const passwordHashed = await bcrypt.hash(password as string, 10);

  const user = await prisma.user.create({
    data: {
      name: name as string,
      email: email as string,
      password: passwordHashed
    }
  });
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