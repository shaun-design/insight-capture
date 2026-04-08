export default function CaseStudiesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /* Matches case-study template --bg so the column reads as one marketing surface */
  return (
    <div className="min-h-screen w-full min-w-0 bg-[#f0f2f8]">{children}</div>
  );
}
