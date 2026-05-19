import { auth } from "../auth";
import { redirect } from "next/navigation";
import Input from "@/components/Forms/Input";
import Button from "@/components/Button/primary";
import Link from "next/link";
import { handleRegister } from "@/app/actions/authentication";

// Register page is dynamic - checks auth state
export const dynamic = 'force-dynamic';

export default async function Register() {
    const session = await auth();

    if(session && session.user && session.user.id) {
        return redirect("/dashboard");
    }

    return <main className="flex items-center justify-center py-10">
          <form className="border rounded-lg bg-white flex flex-col space-y-8 px-8 py-6 drop-shadow w-full md:w-96" action={handleRegister}>
            <h3 className="text-lg text-slate-600 font-bold text-center mb-2">
              Register
            </h3>

            <Input type="text" label="Name" name="name" required />

            <Input type="email" label="Email" name="email" required />

            <Input type="password" label="Password" name="password" required />

            <Button label="Register" variant="primary" type="submit" />

            <p className="text-slate-500 text-sm text-center">
              Got an account? <Link className="font-semibold" href="/login">
                Login here
              </Link>
            </p>
          </form>
      </main>;
}