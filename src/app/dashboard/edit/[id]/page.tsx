import React from 'react';

import { auth } from '@/app/auth';

import prisma from '@/utils/prisma';
import { notFound, redirect } from 'next/navigation';
import { handleUpdate } from '@/app/actions/links';
import LinkForm from '../../LinkForm';

// Edit page is always dynamic - requires authentication and specific link data
export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: { id: string }}) {
    const session = await auth();

    const { id } = params;

    if(!session || !session.user || !session.user.id) {
        return redirect('/login');
    }

    const link = await prisma.link.findFirst({
        where: {
            id,
            userId: session.user.id
        }
    });

    if(!link) {
        return notFound();
    }

    return <main className="flex items-center justify-center py-10">
          <LinkForm action={handleUpdate} heading="Edit Link" submitLabel="Update" link={{ id: link.id, title: link.title, url: link.url }} />
      </main>;
}
