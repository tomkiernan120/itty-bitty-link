"use server";

import { randomInt } from "crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import z from "zod";
import prisma from "@/utils/prisma";
import { MAX_LINKS_PER_USER } from "@/utils/limits";
import { auth } from "../auth";

export type LinkFormState = {
  errors?: {
    title?: string[];
    url?: string[];
    form?: string[];
  };
};

const ALIAS_ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const ALIAS_LENGTH = 7;
const ALIAS_ATTEMPTS = 5;

const isHttpUrl = (value: string) => {
  try {
    const { protocol } = new URL(value);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
};

const linkSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200, "Title must be 200 characters or fewer"),
  url: z
    .string()
    .trim()
    .max(2048, "URL must be 2048 characters or fewer")
    .url("Enter a valid URL")
    .refine(isHttpUrl, "URL must start with http:// or https://")
});

const updatelinkSchema = linkSchema.extend({
  id: z.string().min(1)
});

const idsSchema = z.array(z.string().min(1)).min(1).max(100);

const generateAlias = () =>
  Array.from({ length: ALIAS_LENGTH }, () => ALIAS_ALPHABET[randomInt(ALIAS_ALPHABET.length)]).join("");

// Creates the link with a fresh random alias, retrying if that alias is already taken.
const createLinkWithAlias = async (data: { title: string; url: string; userId: string }) => {
  for (let attempt = 0; attempt < ALIAS_ATTEMPTS; attempt++) {
    try {
      return await prisma.link.create({
        data: {
          ...data,
          image: null,
          alias: generateAlias()
        }
      });
    } catch (err: any) {
      if (err?.code !== "P2002") {
        throw err;
      }
    }
  }

  throw new Error("Could not generate a unique alias");
};

// Links pointing back at this site would only create redirect loops.
const pointsToThisSite = (url: string) => {
  const host = headers().get("host");

  return Boolean(host) && new URL(url).host === host;
};

const getUserId = async () => {
  const session = await auth();

  return session?.user?.id;
};

export const handleDelete = async (id: string) => {
  return handleDeleteMany([id]);
};

export const handleDeleteMany = async (ids: string[]) => {
  const userId = await getUserId();
  const validate = idsSchema.safeParse(ids);

  if (!userId || !validate.success) {
    return false;
  }

  const { count } = await prisma.link.deleteMany({
    where: {
      id: {
        in: validate.data
      },
      userId
    }
  });

  return count > 0;
};

export const handleCreate = async (_prevState: LinkFormState, formData: FormData): Promise<LinkFormState> => {
  const userId = await getUserId();

  if (!userId) {
    redirect("/login");
  }

  const validate = linkSchema.safeParse({
    title: formData.get("title"),
    url: formData.get("url")
  });

  if (!validate.success) {
    return { errors: validate.error.flatten().fieldErrors };
  }

  const { title, url } = validate.data;

  if (pointsToThisSite(url)) {
    return { errors: { url: ["You can't shorten a link to this site"] } };
  }

  const userLinkCount = await prisma.link.count({
    where: {
      userId
    }
  });

  if (userLinkCount >= MAX_LINKS_PER_USER) {
    return { errors: { form: [`Link limit reached. You can only create up to ${MAX_LINKS_PER_USER} links.`] } };
  }

  await createLinkWithAlias({ title, url, userId });

  redirect("/dashboard");
};

export const handleUpdate = async (_prevState: LinkFormState, formData: FormData): Promise<LinkFormState> => {
  const userId = await getUserId();

  if (!userId) {
    redirect("/login");
  }

  const validate = updatelinkSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    url: formData.get("url")
  });

  if (!validate.success) {
    return { errors: validate.error.flatten().fieldErrors };
  }

  const { id, title, url } = validate.data;

  if (pointsToThisSite(url)) {
    return { errors: { url: ["You can't shorten a link to this site"] } };
  }

  const link = await prisma.link.findFirst({
    where: {
      id,
      userId
    }
  });

  if (!link) {
    return { errors: { form: ["Link not found"] } };
  }

  await prisma.link.update({
    where: {
      id: link.id
    },
    data: {
      title,
      url
    }
  });

  redirect("/dashboard");
};
