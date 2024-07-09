import React from "react"; // Add this line

import { auth } from "@/app/auth";
import { handleLogin } from "@/app/actions/authentication";
import GoogleLoginButton from "./GoogleLoginButton";
import Input from "@/components/Forms/Input";
import Button from "@/components/Button/primary";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Login() {
  const session = await auth();

  if (session && session.user && session.user.id) {
    return redirect("/dashboard");
  }

  return <main>
      <div className="px-8 md:px-0 md:mx-auto flex h-auto items-center">
        <form className="border rounded-lg bg-white flex flex-col space-y-8 px-8 py-6 drop-shadow min-w-full md:min-w-80 mt-10 md:mt-28" action={handleLogin}>
          <h3 className="text-lg text-slate-600 mb-2">Login</h3>

          <Input type="email" label="Email" />

          <Input type="password" label="Password" />

          <Button label="Login" variant="primary" type="submit" />

          <GoogleLoginButton />

          <p className="text-slate-500 text-sm text-center">
            Not got an account? <Link className="font-semibold" href="/login">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </main>;
}
