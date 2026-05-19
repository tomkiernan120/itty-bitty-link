import React from "react"; // Add this line

import { auth } from "@/app/auth";
import { handleLogin } from "@/app/actions/authentication";
import GoogleLoginButton from "./GoogleLoginButton";
import Input from "@/components/Forms/Input";
import Button from "@/components/Button/primary";
import { redirect } from "next/navigation";
import Link from "next/link";

// Login page is dynamic - checks auth state
export const dynamic = 'force-dynamic';

export default async function Login() {
  const session = await auth();

  if (session && session.user && session.user.id) {
    return redirect("/dashboard");
  }

  return <main className="flex items-center justify-center py-10">
      <form className="border rounded-lg bg-white flex flex-col space-y-8 px-8 py-6 drop-shadow w-full md:w-96" action={handleLogin}>
          <h3 className="text-lg text-slate-600 font-bold mb-2 text-center">Login</h3>

          <Input type="email" label="Email" name="email" required />

          <Input type="password" label="Password" name="password" required />

          <Button label="Login" variant="primary" type="submit" />

          <GoogleLoginButton />

          <p className="text-slate-500 text-sm text-center">
            Not got an account? <Link className="font-semibold" href="/register">
              Register here
            </Link>
          </p>
        </form>
    </main>;
}
