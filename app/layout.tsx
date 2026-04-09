import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { AppFooter } from "@/components/app-footer";
import { AppHeaderAuth } from "@/components/app-header-auth";
import { ChatWidget } from "@/components/chat-widget";
import { AppNav } from "@/components/app-nav";
import { MainShell } from "@/components/main-shell";
import {
  isPrototypeLoginRoute,
  requirePrototypeSession,
} from "@/lib/require-prototype-session";
import "@/components/case-study/case-study-template.css";
import "./globals.css";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Shaun Herron",
  description: "Prototype demos and case studies.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#dce7f1",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requirePrototypeSession();
  const signInShell = await isPrototypeLoginRoute();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} antialiased flex flex-col`}
        style={{ background: "linear-gradient(to bottom, #ffffff 0%, #dce7f1 100%)", minHeight: "100vh" }}
        suppressHydrationWarning
      >
        <header className="sticky top-0 z-[55] border-b border-[#e5e7eb] bg-[rgba(255,255,255,0.85)] backdrop-blur-md supports-[backdrop-filter]:bg-[rgba(255,255,255,0.75)]">
          {signInShell ? (
            <div className="flex min-h-14 w-full items-center px-4 py-3 md:px-8">
              <Link
                href="/"
                className="flex min-w-0 shrink-0 items-center gap-2.5 rounded-lg outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0a6ab1]/40"
              >
                <Image src="/logo.png" alt="" width={32} height={32} className="size-8 shrink-0" />
                <span className="max-w-[9rem] truncate text-sm font-semibold text-[#0a6ab1] min-[380px]:max-w-[14rem] sm:max-w-none">
                  Mapleleaf Academy
                </span>
              </Link>
            </div>
          ) : (
            <div className="relative flex min-h-14 w-full items-center gap-3 px-4 py-3 md:px-8">
              <Link
                href="/"
                className="z-10 flex min-w-0 max-w-[45%] shrink-0 items-center gap-2.5 rounded-lg outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0a6ab1]/40 md:absolute md:left-8 md:top-1/2 md:max-w-[min(240px,40vw)] md:-translate-y-1/2"
              >
                <Image src="/logo.png" alt="" width={32} height={32} className="size-8 shrink-0" />
                <span className="max-w-[9rem] truncate text-sm font-semibold text-[#0a6ab1] min-[380px]:max-w-[14rem] sm:max-w-none">
                  Mapleleaf Academy
                </span>
              </Link>

              <div className="flex min-w-0 flex-1 justify-end md:absolute md:left-1/2 md:top-1/2 md:w-auto md:flex-none md:-translate-x-1/2 md:-translate-y-1/2 md:justify-center">
                <AppNav />
              </div>

              <div className="hidden shrink-0 items-center gap-3 md:flex md:absolute md:right-8 md:top-1/2 md:-translate-y-1/2">
                <AppHeaderAuth />
              </div>
            </div>
          )}
        </header>

        <MainShell>{children}</MainShell>

        <AppFooter showHelp={!signInShell} />

        {!signInShell && <ChatWidget />}
      </body>
    </html>
  );
}
