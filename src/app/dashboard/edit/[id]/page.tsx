import React from 'react';

import { auth } from '@/app/auth';

import prisma from '@/utils/prisma';
import { redirect } from 'next/navigation';
import { handleUpdate } from '@/app/actions/links';
import Input from '@/components/Forms/Input';
import Button from '@/components/Button/primary';

// Edit page is always dynamic - requires authentication and specific link data
export const dynamic = 'force-dynamic';

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

    if(!link) {
        return redirect('/dashboard');
    }

    return <main className="flex items-center justify-center py-10">
          <form className="border rounded-lg bg-white flex flex-col space-y-8 px-8 py-6 drop-shadow w-full md:w-96" action={handleUpdate}>
            <h3 className="text-lg text-slate-700 font-bold mb-2">Edit Link</h3>

            <input type="hidden" name="id" value={id} />

            <Input type="text" label="Title" name="title" required defaultValue={link.title} />

            <Input type="url" required label="URL" name="url" defaultValue={link.url} />

            <Button type="submit" variant="primary" label="Update" />
          </form>
      </main>;
}