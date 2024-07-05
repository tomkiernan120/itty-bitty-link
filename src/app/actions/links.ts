"use server";

import prisma from "@/utils/prisma";
import { auth } from "../auth";
import { redirect } from "next/navigation";
import z from "zod";

const linkSchema = z.object({
  title: z.string().min(1),
  url: z.string().url()
});

export const handleDelete = async (id: string) => {
  "use server";

  try {
    await prisma.link.delete({
      where: {
        id
      }
    });
    return true;
  } catch (err) {
    return err;
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

export const handleCreate = async (formData: FormData) => {
  "use server";
  try {
    const session = await auth();

    if (!session) {
      return;
    }

    const title = formData.get("title") as string;
    const url = formData.get("url") as string;

    console.log(title);

    const validate = linkSchema.safeParse({
      title,
      url
    });

    console.log(validate);

    if (!validate.success) {
      throw new Error(validate.error);
      return;
    }

    let linkAlias;

    linkAlias = await prisma.linkAlias.findFirst({
      where: {
        url: url as string
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

    const link = await prisma.link.create({
      data: {
        title,
        image: null,
        linkAliasId: linkAlias?.id,
        url,
        userId: session.user.id as string
      }
    });
  } catch (err) {
    throw new Error(err);
  }

  // redirect to /dashboard
  redirect("/dashboard");
};

export const handleUpdate = async (formData: FormData, id: string) => {
  "use server";
  const title = formData.get("title") as string;
  const url = formData.get("url") as string;
  let linkAlias;

  let link = await prisma.link.findUnique({
    where: {
      id
    }
  });

  if (url !== link.url) {
    linkAlias = await prisma.linkAlias.findUnique({
      where: {
        url: url as string
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

  link = await prisma.link.update({
    where: {
      id
    },
    data: {
      title,
      url,
      linkAliasId: linkAlias?.id
    }
  });
};
