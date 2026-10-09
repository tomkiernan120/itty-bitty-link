"use server";

import prisma from "@/utils/prisma";
import { auth } from "../auth";
import { redirect } from "next/navigation";
import z from "zod";

type ActionResult<T = null> =
  | { success: true; data?: T }
  | { success: false; error: string };

const linkSchema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z.string().url("Valid URL is required")
});

const updatelinkSchema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z.string().url("Valid URL is required"),
  id: z.string()
});

export const handleDelete = async (id: string): Promise<ActionResult> => {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    const link = await prisma.link.findUnique({
      where: { id }
    });

    if (!link) {
      return { success: false, error: "Link not found" };
    }

    if (link.userId !== session.user.id) {
      return { success: false, error: "Unauthorised" };
    }

    await prisma.link.delete({
      where: { id }
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete link" };
  }
};

export const generateAlias = async (): Promise<string> => {
  // a function that  generates a random string of 6 characters or more to use as a unique alias only increasing the length if the alias already exists

  const alias = Math.random().toString(36).substring(2, 8);

  const linkAlias = await prisma.linkAlias.findUnique({
    where: {
      alias
    }
  });

  if (linkAlias) {
    return generateAlias();
  }

  return alias;
};

export const handleCreate = async (formData: FormData): Promise<ActionResult> => {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return { success: false, error: "Not authenticated" };
    }

    // Check if user has reached the 5-link limit
    const userLinkCount = await prisma.link.count({
      where: {
        userId: session.user.id as string
      }
    });

    if (userLinkCount >= 5) {
      return { success: false, error: "Link limit reached. You can only create up to 5 links." };
    }

    const title = formData.get("title") as string;
    const url = formData.get("url") as string;

    const validate = linkSchema.safeParse({
      title,
      url
    });

    if (!validate.success) {
      const errorMessage = validate.error.issues[0]?.message || "Validation failed";
      return { success: false, error: errorMessage };
    }

    let linkAlias = await prisma.linkAlias.findFirst({
      where: {
        url
      }
    });

    if (!linkAlias) {
      linkAlias = await prisma.linkAlias.create({
        data: {
          url,
          alias: await generateAlias()
        }
      });
    }

    await prisma.link.create({
      data: {
        title,
        image: null,
        linkAliasId: linkAlias.id,
        url,
        userId: session.user.id as string
      }
    });

    redirect("/dashboard");
  } catch (err: any) {
    // Let NEXT_REDIRECT propagate
    if (err?.digest) {
      throw err;
    }
    return { success: false, error: err.message || "Failed to create link" };
  }
};

export const handleUpdate = async (formData: FormData): Promise<ActionResult> => {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    const validate = updatelinkSchema.safeParse(Object.fromEntries(formData));

    if (!validate.success) {
      const errorMessage = validate.error.issues[0]?.message || "Validation failed";
      return { success: false, error: errorMessage };
    }

    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const url = formData.get("url") as string;

    const link = await prisma.link.findUnique({
      where: { id }
    });

    if (!link) {
      return { success: false, error: "Link not found" };
    }

    if (link.userId !== session.user.id) {
      return { success: false, error: "Unauthorised" };
    }

    let linkAlias;

    if (url !== link.url) {
      linkAlias = await prisma.linkAlias.findFirst({
        where: {
          url
        }
      });

      if (!linkAlias) {
        linkAlias = await prisma.linkAlias.create({
          data: {
            url,
            alias: await generateAlias()
          }
        });
      }
    }

    await prisma.link.update({
      where: { id },
      data: {
        title,
        url,
        linkAliasId: linkAlias?.id
      }
    });

    redirect("/dashboard");
  } catch (err: any) {
    // Let NEXT_REDIRECT propagate
    if (err?.digest) {
      throw err;
    }
    return { success: false, error: err.message || "Failed to update link" };
  }
};
