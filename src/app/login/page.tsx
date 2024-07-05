import React from "react"; // Add this line

import { auth } from "@/app/auth";
import { handleLogin } from "@/app/actions/authentication";
import GoogleLoginButton from "./GoogleLoginButton";
import Input from "@/components/Forms/Input";
import Button from "@/components/Button/primary";
import { redirect } from "next/navigation";

export default async function Login() {
  const session = await auth();

  if (session) {
    return redirect("/dashboard");
  }

  return (
    <main>
      <div className="mx-auto flex h-auto items-center">
        <form
          className="border rounded-lg bg-white flex flex-col space-y-8 px-8 py-6 drop-shadow min-w-80 mt-28"
          action={handleLogin}
        >
          <h3 className="text-lg text-slate-600 mb-2">Login</h3>

          <Input type="email" label="Email"  />

          <Input type="password" label="Password" />

          <Button label="Login" variant="primary" type="submit" />

          <GoogleLoginButton />
        </form>
      </div>
    </main>
  );
}
