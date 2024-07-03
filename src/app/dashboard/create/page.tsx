import React from "react";
import { auth } from "@/app/auth";

import prisma from "@/utils/prisma";
import { redirect } from "next/navigation";


export default async function Page() {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
        return redirect("/login");
    }

    const handleSubmit = async (formData: FormData) => {
        "use server"
        const title = formData.get("title") as string;
        const url = formData.get("url") as string;

        const link = await prisma.link.create({
            data: {
                title,
                image: null,
                url,
                userId: session.user.id as string,
            },
        });

        redirect('/dashboard');
    }

    return (
        <main>
            <form action={handleSubmit}>
                <label htmlFor="title">Title</label>
                <input type="text" name="title" />

                <label htmlFor="url">URL</label>
                <input type="url" name="url" />

                <button type="submit">Create Link</button>
            </form>
        </main>
    )
}