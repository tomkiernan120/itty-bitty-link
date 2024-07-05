import { auth } from "@/app/auth";

import prisma from "@/utils/prisma";

export async function GET(request: Request ) {
    const session = await auth();

    if (!session) {
        return new Response("Unauthorized", { status: 401 });
    }

    var num_per_page = 10;
    var page = parseInt(request.nextUrl.searchParams.get('page'));

    var skip = (page > 0 ? page - 1 : 0) * num_per_page;
    var take = num_per_page;


    const links = await prisma.link.findMany({
        where: {
            userId: session.userId,
        },
        include: {
            linkAlias: true,
        },
        orderBy: {
            createdAt: 'asc',
        },
        skip: skip,
        take: take,
    });

    var numPages = Math.ceil(await prisma.link.count({
        where: {
            userId: session.userId,
        }
    }) / num_per_page);

    return new Response(JSON.stringify({ links: links, pages: numPages }));
}