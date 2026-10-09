import { auth } from "@/app/auth";
import prisma from "@/utils/prisma";

export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const session = await auth();

    if (!session) {
        return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const link = await prisma.link.findUnique({
        where: {
            id: params.id
        }
    });

    if (!link) {
        return Response.json({ success: false, error: "Link not found" }, { status: 404 });
    }

    if (link.userId !== session.user?.id) {
        return Response.json({ success: false, error: "Unauthorised" }, { status: 403 });
    }

    return Response.json({
        success: true,
        link: {
            id: link.id,
            title: link.title,
            url: link.url
        }
    });
}
