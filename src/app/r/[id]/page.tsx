import prisma from "@/utils/prisma";
import { redirect } from "next/navigation";

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

    console.log(linkAlias);

    if(linkAlias) {
        // redirect to the link
        return redirect(linkAlias.links[0].url)
    }
    else {
        // redirect to 404
        return redirect("/404");
    }
}