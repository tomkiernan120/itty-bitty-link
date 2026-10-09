"use client";

import { auth } from "@/app/auth";
import { handleLogin } from "@/app/actions/authentication";
import GoogleLoginButton from "./GoogleLoginButton";
import Input from "@/components/Forms/Input";
import Button from "@/components/Button/primary";
import Link from "next/link";
import { useState } from "react";

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    setIsPending(true);

    try {
      const result = await handleLogin(formData);

      if (!result.success) {
        setError(result.error);
        return;
      }
      // If successful, will redirect automatically
    } catch (err: any) {
      // Let NEXT_REDIRECT propagate
      if (err?.digest) {
        throw err;
      }
      setError("An unexpected error occurred");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <main className="flex items-center justify-center py-10">
      <form className="border rounded-lg bg-white flex flex-col space-y-8 px-8 py-6 drop-shadow w-full md:w-96" action={handleSubmit}>
        <h3 className="text-lg text-slate-600 font-bold mb-2 text-center">Login</h3>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <Input type="email" label="Email" name="email" required disabled={isPending} />

        <Input type="password" label="Password" name="password" required disabled={isPending} />

        <Button label={isPending ? "Logging in..." : "Login"} variant="primary" type="submit" loading={isPending} disabled={isPending} />

        <GoogleLoginButton />

        <p className="text-slate-500 text-sm text-center">
          Not got an account? <Link className="font-semibold" href="/register">
            Register here
          </Link>
        </p>
      </form>
    </main>
  );
}
