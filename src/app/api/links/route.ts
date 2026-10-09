import { auth } from "@/app/auth";

import prisma from "@/utils/prisma";

// Dynamic route - user-specific data changes per request
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const session = await auth();

    if (!session) {
        return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const num_per_page = 10;
    const page = parseInt((request as any).nextUrl.searchParams.get('page') || '1');

    const skip = (page > 0 ? page - 1 : 0) * num_per_page;
    const take = num_per_page;

    const links = await prisma.link.findMany({
        where: {
            userId: session?.user?.id as string,
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

    const totalCount = await prisma.link.count({
        where: {
            userId: session?.user?.id as string,
        }
    });

    const numPages = Math.ceil(totalCount / num_per_page);

    return Response.json({
        success: true,
        links: links,
        pages: numPages,
        total: totalCount,
        count: totalCount
    });
}