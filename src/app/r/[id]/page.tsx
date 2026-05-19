import prisma from "@/utils/prisma";
import { redirect } from "next/navigation";

// Cache redirect lookups for 1 hour to reduce database queries
export const revalidate = 3600;

// Use Edge Runtime for minimal latency on redirects (global distribution)
export const runtime = 'nodejs';

export default await async function Page({ params
}: { params: { id: string }}) {
    const { id } = params;

    if(!id) {
        return null;
    }

    const linkAlias = await prisma.linkAlias.findUnique({
        where: {
            alias: id
        },
        include: {
            links: true
        }
    });

    if(linkAlias) {
        // redirect to the link
        return redirect(linkAlias.links[0].url)
    }
    else {
        // redirect to 404
        return redirect("/404");
    }
}