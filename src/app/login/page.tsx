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

const errorMessages: Record<string, string> = {
  invalid_credentials: "Incorrect email or password.",
  OAuthAccountNotLinked: "That email is already registered with a password. Log in with your password instead.",
};

export default async function Login({ searchParams }: { searchParams: { error?: string } }) {
  const session = await auth();

  if (session && session.user && session.user.id) {
    return redirect("/dashboard");
  }

  const error = searchParams.error
    ? errorMessages[searchParams.error] ?? "Something went wrong while logging in. Please try again."
    : null;

  return <main className="flex items-center justify-center py-10">
      <form className="border rounded-lg bg-white flex flex-col space-y-8 px-8 py-6 drop-shadow w-full md:w-96" action={handleLogin}>
          <h3 className="text-lg text-slate-600 font-bold mb-2 text-center">Login</h3>

          {error && (
            <div role="alert" className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

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
