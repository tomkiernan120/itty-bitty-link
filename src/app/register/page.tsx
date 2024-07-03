import prisma from "@/utils/prisma"
import bcrypt from "bcryptjs";
import { auth } from "../auth";
import { redirect } from "next/navigation";

export default async function Register() {
    const session = await auth();

    if(session) {
        return redirect("/dashboard");
    }

    const handleSubmit = async (formdata: FormData) => {
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


        console.log(user);
    }

    return (
        <main>
            <h1>Register</h1>

            <form action={handleSubmit}>
                <label htmlFor="name">Name</label>
                <input type="text" name="name" />

                <label htmlFor="email">Email</label>
                <input type="email" name="email" />

                <label htmlFor="password">Password</label>
                <input type="password" name="password" />

                <button type="submit">Register</button>

            </form>
        </main>
    )
}