import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/default";
import Footer from "@/components/Footer";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";

const rubik = Rubik({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-rubik',
});

export const metadata: Metadata = {
  title: "Itty Bitty Link",
  description: "Like TinyURL, but itty bitty-er.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={rubik.className}>
        <SessionProviderWrapper>
          <Header />
        </SessionProviderWrapper>
        <div className="background">
          <div className="inner"></div>
        </div>
        {children}
        <Footer />
        </body>
    </html>
  );
}
