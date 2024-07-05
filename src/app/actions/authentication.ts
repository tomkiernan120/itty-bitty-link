import { signIn } from "next-auth/react";

export const handleRegister = async (formdata: FormData) => {
  "use server";

  const { name, email, password } = Object.fromEntries(formdata);

  const passwordHashed = await bcrypt.hash(password, 10);

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
  await signIn("credentials", formdata, {
    redirectTo: "/dashboard"
  });
};