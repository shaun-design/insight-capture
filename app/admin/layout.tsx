import { auth } from "@clerk/nextjs/server";
import { isClerkConfigured } from "@/lib/clerk-configured";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (isClerkConfigured()) {
    await auth.protect();
  }
  return <>{children}</>;
}
