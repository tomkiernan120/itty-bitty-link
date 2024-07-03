import React from "react";
import { auth } from "@/app/auth";

import { handleCreate } from "@/app/actions/links";
import { redirect } from "next/navigation";


export default async function Page() {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
        return redirect("/login");
    }

    return <main>
        <form action={handleCreate}>
          <label htmlFor="title">Title</label>
          <input type="text" name="title" />

          <label htmlFor="url">URL</label>
          <input type="url" name="url" />

          <button type="submit">Create Link</button>
        </form>
      </main>;
}