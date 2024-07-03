import prisma from "@/utils/prisma";
import { redirect } from "next/navigation";

export default await async function Page({ params
}: { params: { id: string }}) {
    const { id } = params;

    if(!id) {
        return null;
    }

    const link = await prisma.link.findUnique({
        where: {
            id
        }
    });

    if(link) {
        // redirect to the link
        return redirect(link.url)
    }

    
    return null;
}