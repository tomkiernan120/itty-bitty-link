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
      <h1>Dashboard</h1>

      <p>Welcome to the dashboard</p>

      <SessionProviderWrapper>
        <LinksList />
      </SessionProviderWrapper>
    </main>
  );
}
