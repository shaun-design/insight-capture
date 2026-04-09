import { enforceAppSegmentAuth } from "@/lib/enforce-app-segment-auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CoachLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await enforceAppSegmentAuth();
  return <>{children}</>;
}
