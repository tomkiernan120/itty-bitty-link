import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <section>

          <h1>Itty Bitty Link</h1>

          <Link href="/login">Login</Link>
          <Link href="/register">Create an account</Link>

      </section>
    </main>
  );
}
