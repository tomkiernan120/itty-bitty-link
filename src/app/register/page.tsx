"use client";

import { useState } from "react";
import Input from "@/components/Forms/Input";
import Button from "@/components/Button/primary";
import Link from "next/link";
import { handleRegister } from "@/app/actions/authentication";

export default function Register() {
    const [error, setError] = useState<string | null>(null);
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setError(null);
        setIsPending(true);

        try {
            await handleRegister(formData);
        } catch (err: any) {
            const errorMessage = err.message || "Registration failed";

            // Parse validation errors from JSON string if needed
            if (errorMessage.startsWith("[")) {
                try {
                    const issues = JSON.parse(errorMessage);
                    if (Array.isArray(issues) && issues.length > 0) {
                        setError(issues[0].message);
                    } else {
                        setError(errorMessage);
                    }
                } catch {
                    setError(errorMessage);
                }
            } else {
                setError(errorMessage);
            }
        } finally {
            setIsPending(false);
        }
    };

    return (
        <main className="flex items-center justify-center py-10">
            <form className="border rounded-lg bg-white flex flex-col space-y-8 px-8 py-6 drop-shadow w-full md:w-96" action={handleSubmit}>
                <h3 className="text-lg text-slate-600 font-bold text-center mb-2">
                    Register
                </h3>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <Input type="text" label="Name" name="name" required disabled={isPending} />

                <Input type="email" label="Email" name="email" required disabled={isPending} />

                <Input type="password" label="Password" name="password" required disabled={isPending} />

                <Button label={isPending ? "Registering..." : "Register"} variant="primary" type="submit" loading={isPending} disabled={isPending} />

                <p className="text-slate-500 text-sm text-center">
                    Got an account? <Link className="font-semibold" href="/login">
                        Login here
                    </Link>
                </p>
            </form>
        </main>
    );
}