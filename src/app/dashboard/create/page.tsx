import React from "react";
import { auth } from "@/app/auth";

import { handleCreate } from "@/app/actions/links";
import { redirect } from "next/navigation";
import Input from "@/components/Forms/Input";
import Button from "@/components/Button/primary";
import { useFormState } from "react-dom";
import { SubmitButton } from "@/components/Forms/SubmitButton";

export default async function Page() {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return redirect("/login");
  }

  return <main>
      <div className="px-8 md:px-0 mx-auto flex h-auto items-center">
        <form className="border rounded-lg bg-white flex flex-col space-y-8 px-8 py-6 drop-shadow w-full md:min-w-80 mt-28" action={handleCreate}>
          <h3 className="text-lg text-slate-600 mb-2">Create Link</h3>

          <Input type="text" label="Title" name="title" required />

          <Input type="url" required label="URL" name="url" />

          <SubmitButton>Create</SubmitButton>
        </form>
      </div>
    </main>;
}
