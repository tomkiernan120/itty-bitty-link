import { auth } from "../auth";
import { redirect } from "next/navigation";
import Input from "@/components/Forms/Input";
import Button from "@/components/Button/primary";
import Link from "next/link";
import { handleRegister } from "@/app/actions/authentication";

export default async function Register() {
    const session = await auth();

    if(session) {
        return redirect("/dashboard");
    }

    return <main>
        <div className="px-8 md:mx-auto flex h-auto items-center">
          <form className="border rounded-lg bg-white flex flex-col space-y-8 px-8 py-6 drop-shadow min-w-full md:min-w-80 mt-10 md:mt-28" action={handleRegister}>
            <h3 className="text-lg text-slate-600 mb-2">
              Register an account
            </h3>

            <Input type="text" label="Name" />

            <Input type="email" label="Email" />

            <Input type="password" label="Password" />

            <Button label="Register" variant="primary" type="submit" />

            <p className="text-slate-500 text-sm text-center">
              Got an account? <Link className="font-semibold" href="/login">
                Login here
              </Link>
            </p>
          </form>
        </div>
      </main>;
}