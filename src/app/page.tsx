import Intro from "./Intro";

// Home page is static - can be cached indefinitely
export const revalidate = 86400; // 24 hours

export default function Home() {
  return (
    <main>
      <Intro />
    </main>
  );
}
