import React from "react";
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import LinksList from "./LinksList";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";

export default async function Page() {
  const session = await auth();

  if (!session) {
    return redirect("/login");
  }

  return (
    <main>
      <div className="container mx-auto space-y-2 py-10">
        <div className="flex flex-col space-y-2 mb-8">
          <h2 className="text-2xl font-bold text-gray-500">Dashboard</h2>
          <p className="text-gray-700 mb-12">Welcome to your dashboard, {session?.user?.name ?? session?.user?.email}!</p>
        </div>


        <SessionProviderWrapper>
          <LinksList />
        </SessionProviderWrapper>
      </div>
    </main>
  );
}
