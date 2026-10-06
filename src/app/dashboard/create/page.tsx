import React from "react";
import { auth } from "@/app/auth";
import prisma from "@/utils/prisma";
import { handleCreate } from "@/app/actions/links";
import { redirect } from "next/navigation";
import Button from "@/components/Button/primary";
import { MAX_LINKS_PER_USER } from "@/utils/limits";
import LinkForm from "../LinkForm";

// Create page is always dynamic - requires authentication
export const dynamic = 'force-dynamic';

export default async function Page() {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return redirect("/login");
  }

  // Check current link count
  const linkCount = await prisma.link.count({
    where: {
      userId: session.user.id
    }
  });

  const isAtLimit = linkCount >= MAX_LINKS_PER_USER;

  if (isAtLimit) {
    return <main className="flex items-center justify-center py-10">
      <div className="border rounded-lg bg-white flex flex-col space-y-6 px-8 py-6 drop-shadow w-full md:w-96">
        <h3 className="text-lg text-slate-700 font-bold mb-2">Link Limit Reached</h3>
        <p className="text-slate-600 text-sm">
          You have reached the maximum of <span className="font-semibold">{MAX_LINKS_PER_USER} links</span>.
          To create a new link, you must delete one of your existing links first.
        </p>
        <Button type="link" href="/dashboard" variant="primary" label="Back to Dashboard" />
      </div>
    </main>;
  }

  return <main className="flex items-center justify-center py-10">
        <LinkForm action={handleCreate} heading="Create Link" submitLabel="Create" hint={`${linkCount}/${MAX_LINKS_PER_USER} links`} />
    </main>;
}
