import React from "react";
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import LinksList from "./LinksList";

// Dashboard is always dynamic - user-specific data
export const dynamic = 'force-dynamic';

export default async function Page() {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return redirect("/login");
  }

  return (
    <main>
      <div className="container px-8 md:px-0 md:mx-auto space-y-2 py-10">
        <div className="flex flex-col space-y-2 mb-8">
          <h2 className="text-2xl font-bold text-slate-700">Dashboard</h2>
          <p className="text-slate-600 mb-12">Welcome to your dashboard, {session?.user?.name ?? session?.user?.email}!</p>
        </div>


        <LinksList />
      </div>
    </main>
  );
}
