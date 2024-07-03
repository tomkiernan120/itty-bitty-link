import { auth } from "@/app/auth";

import prisma from "@/utils/prisma";

export async function GET(request: Request ) {
    const session = await auth();

    if (!session) {
        return new Response("Unauthorized", { status: 401 });
    }

    const links = await prisma.link.findMany({
        where: {
            userId: session.userId,
        },
    });

    return new Response(JSON.stringify(links));
}