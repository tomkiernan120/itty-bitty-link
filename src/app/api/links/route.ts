import { auth } from "@/app/auth";

import prisma from "@/utils/prisma";

// Dynamic route - user-specific data changes per request
export const dynamic = 'force-dynamic';

export async function GET(request: Request ) {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
        return new Response("Unauthorized", { status: 401 });
    }

    const userId = session.user.id;

    var num_per_page = 10;
    var page = parseInt(new URL(request.url).searchParams.get('page') ?? '1', 10);

    var skip = (page > 0 ? page - 1 : 0) * num_per_page;
    var take = num_per_page;


    const links = await prisma.link.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: 'asc',
        },
        skip: skip,
        take: take,
    });

    const totalCount = await prisma.link.count({
        where: {
            userId,
        }
    });

    var numPages = Math.ceil(totalCount / num_per_page);

    return Response.json({ links: links, pages: numPages, total: totalCount });
}
