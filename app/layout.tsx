import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import {
  ClerkProvider,
  Show,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { ChatWidget } from "@/components/chat-widget";
import { AppNav } from "@/components/app-nav";
import "./globals.css";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Mapleleaf Academy",
  description: "Dataforms application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${fontSans.variable} antialiased flex flex-col`}
          style={{ background: "linear-gradient(to bottom, #ffffff 0%, #dce7f1 100%)", minHeight: "100vh" }}
          suppressHydrationWarning
        >
          <header style={{ background: "rgba(255,255,255,0.85)", borderBottom: "1px solid #e5e7eb", position: "sticky", top: 0, zIndex: 40, backdropFilter: "blur(8px)" }}>
            <div
              style={{
                position: "relative",
                width: "100%",
                padding: "12px 32px",
                display: "flex",
                alignItems: "center",
                minHeight: 56,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                <Image src="/logo.png" alt="Logo" width={32} height={32} style={{ width: 32, height: 32 }} />
                <span style={{ fontWeight: 600, fontSize: 14, color: "#0a6ab1" }}>Mapleleaf Academy</span>
              </div>

              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <AppNav />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12, marginLeft: "auto", flexShrink: 0 }}>
                <Show when="signed-out">
                  <SignInButton>
                    <button className="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity">
                      Sign in
                    </button>
                  </SignInButton>
                </Show>
                <Show when="signed-in">
                  <UserButton />
                </Show>
              </div>

            </div>
          </header>

          <main className="flex-1" style={{ maxWidth: 1200, width: "100%", margin: "0 auto", padding: "40px 32px" }}>
            {children}
          </main>

          <footer style={{ borderTop: "1px solid #e5e7eb", background: "rgba(255,255,255,0.6)", backdropFilter: "blur(8px)" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>
                © {new Date().getFullYear()} Mapleleaf Academy. All rights reserved.
              </p>
              <a
                href="#"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                style={{ textDecoration: "none" }}
              >
                Help
              </a>
            </div>
          </footer>

          <ChatWidget />

        </body>
      </html>
    </ClerkProvider>
  );
}
