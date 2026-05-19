import { auth } from "@/app/auth";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

export default async function DebugPage() {
  const session = await auth();
  const cookieStore = cookies();
  const allCookies = cookieStore.getAll().map((cookie) => ({
    name: cookie.name,
    hasValue: Boolean(cookie.value),
    length: cookie.value.length,
  }));

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Session</h1>
      <h2 className="text-lg font-semibold mb-2">Cookies</h2>
      <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 mb-4">
        {JSON.stringify(allCookies, null, 2)}
      </pre>
      <h2 className="text-lg font-semibold mb-2">auth() result</h2>
      <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
        {JSON.stringify(session, null, 2)}
      </pre>
    </main>
  );
}
