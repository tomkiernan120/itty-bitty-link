import React from 'react';

import { auth } from '@/app/auth';

import prisma from '@/utils/prisma';
import { redirect } from 'next/navigation';

export default async function Page({ params }: { params: { id: string }}) {
    const session = await auth();

    const { id } = params;
    
    if(!session) {
        return redirect('/login');
    }

    const link = await prisma.link.findUnique({
        where: {
            id
        }
    });

    const handleSubmit = async (formData) => {
        "use server";
        const title = formData.get("title") as string;
        const url = formData.get("url") as string;

        const updatedLink = await prisma.link.update({
            where: {
                id
            },
            data: {
                title,
                url
            }
        });

        redirect('/dashboard');
    }

    return (
        <main>
            <h1>Edit Link</h1>
            <form action={handleSubmit}>
                <label htmlFor="title">Title</label>
                <input type="text" name="title" defaultValue={link.title} />

                <label htmlFor="url">URL</label>
                <input type="url" name="url" defaultValue={link.url} />

                <button type="submit">Update Link</button>
            </form>
        </main>
    )
}