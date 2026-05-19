import React from "react";
import { auth } from "@/app/auth";
import prisma from "@/utils/prisma";
import { handleCreate } from "@/app/actions/links";
import { redirect } from "next/navigation";
import Input from "@/components/Forms/Input";
import Button from "@/components/Button/primary";
import { useFormState } from "react-dom";
import { SubmitButton } from "@/components/Forms/SubmitButton";

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

  const isAtLimit = linkCount >= 5;

  if (isAtLimit) {
    return <main className="flex items-center justify-center py-10">
      <div className="border rounded-lg bg-white flex flex-col space-y-6 px-8 py-6 drop-shadow w-full md:w-96">
        <h3 className="text-lg text-slate-700 font-bold mb-2">Link Limit Reached</h3>
        <p className="text-slate-600 text-sm">
          You have reached the maximum of <span className="font-semibold">5 links</span>.
          To create a new link, you must delete one of your existing links first.
        </p>
        <Button type="link" href="/dashboard" variant="primary" label="Back to Dashboard" />
      </div>
    </main>;
  }

  return <main className="flex items-center justify-center py-10">
        <form className="border rounded-lg bg-white flex flex-col space-y-8 px-8 py-6 drop-shadow w-full md:w-96" action={handleCreate}>
          <div>
            <h3 className="text-lg text-slate-700 font-bold mb-2">Create Link</h3>
            <p className="text-xs text-slate-500">{linkCount}/5 links</p>
          </div>

          <Input type="text" label="Title" name="title" required />

          <Input type="url" required label="URL" name="url" />

          <SubmitButton>Create</SubmitButton>
        </form>
    </main>;
}
