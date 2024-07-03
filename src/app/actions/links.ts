"use server";

import prisma from "@/utils/prisma";

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
