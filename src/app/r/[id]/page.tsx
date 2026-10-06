import prisma from "@/utils/prisma";
import { notFound, redirect } from "next/navigation";

// Always look the alias up so edited and deleted links take effect immediately
export const dynamic = 'force-dynamic';

export default async function Page({ params
}: { params: { id: string }}) {
    const { id } = params;

    const link = await prisma.link.findUnique({
        where: {
            alias: id
        }
    });

    if(!link) {
        return notFound();
    }

    return redirect(link.url);
}
