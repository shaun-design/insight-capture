"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Search, ChevronLeft, ChevronRight, FileEdit } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  readCoachCompletionsRaw,
  COACH_COMPLETIONS_CHANGED_EVENT,
} from "@/lib/coach-completions-storage";
/** Demo coach identity — only completions by this user appear in the table */
export const COACH_DEMO_COMPLETER = "James Carter";

type CompletionStatus = "Submitted" | "In progress";

interface CoachCompletion {
  id: string;
  formName: string;
  category: string;
  completedAt: string;
  completedAtIso: string;
  about: string;
  status: CompletionStatus;
  completedBy: string;
}

/** Mock catalog includes other coaches' work; the page filters to this coach only */
const MOCK_COMPLETIONS: CoachCompletion[] = [
  {
    id: "c1",
    formName: "Classroom Observation Form",
    category: "Instruction & Teaching",
    completedAt: "Apr 7, 2026",
    completedAtIso: "2026-04-07T15:00:00.000Z",
    about: "Maya Johnson",
    status: "Submitted",
    completedBy: COACH_DEMO_COMPLETER,
  },
  {
    id: "c2",
    formName: "Coaching Session Notes",
    category: "Coaching",
    completedAt: "Apr 5, 2026",
    completedAtIso: "2026-04-05T15:00:00.000Z",
    about: "Carlos Rivera",
    status: "Submitted",
    completedBy: COACH_DEMO_COMPLETER,
  },
  {
    id: "c3",
    formName: "Student Behavior Log",
    category: "Student Behavior",
    completedAt: "Apr 1, 2026",
    completedAtIso: "2026-04-01T15:00:00.000Z",
    about: "Emma Chen",
    status: "Submitted",
    completedBy: COACH_DEMO_COMPLETER,
  },
  {
    id: "c4",
    formName: "Attendance Intervention Form",
    category: "Attendance",
    completedAt: "Mar 22, 2026",
    completedAtIso: "2026-03-22T15:00:00.000Z",
    about: "Liam Thompson",
    status: "In progress",
    completedBy: COACH_DEMO_COMPLETER,
  },
  {
    id: "x1",
    formName: "Peer observation",
    category: "Coaching",
    completedAt: "Mar 10, 2026",
    completedAtIso: "2026-03-10T15:00:00.000Z",
    about: "Staff group A",
    status: "Submitted",
    completedBy: "Maria Gonzalez",
  },
];

export default function CoachDemoPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [completionSync, setCompletionSync] = useState(0);

  useEffect(() => {
    function bump() {
      setCompletionSync((n) => n + 1);
    }
    window.addEventListener(COACH_COMPLETIONS_CHANGED_EVENT, bump);
    window.addEventListener("storage", bump);
    return () => {
      window.removeEventListener(COACH_COMPLETIONS_CHANGED_EVENT, bump);
      window.removeEventListener("storage", bump);
    };
  }, []);

  const myCompletions = useMemo(() => {
    const fromStorage: CoachCompletion[] = readCoachCompletionsRaw()
      .filter((r) => r.completedBy === COACH_DEMO_COMPLETER)
      .map((r) => ({
        id: r.id,
        formName: r.formName,
        category: r.category,
        about: r.about,
        completedAtIso: r.completedAtIso,
        completedAt: new Date(r.completedAtIso).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        status: "Submitted" as const,
        completedBy: r.completedBy,
      }));
    const fromMock = MOCK_COMPLETIONS.filter((r) => r.completedBy === COACH_DEMO_COMPLETER);
    const byId = new Map<string, CoachCompletion>();
    for (const r of fromMock) byId.set(r.id, r);
    for (const r of fromStorage) byId.set(r.id, r);
    return Array.from(byId.values()).sort(
      (a, b) => new Date(b.completedAtIso).getTime() - new Date(a.completedAtIso).getTime()
    );
  }, [completionSync]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    setPage(1);
    return myCompletions.filter(
      (r) =>
        r.formName.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.about.toLowerCase().includes(q)
    );
  }, [myCompletions, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const firstItem = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const lastItem = Math.min(safePage * pageSize, filtered.length);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Coach Demo</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            View forms you have completed as a coach ({COACH_DEMO_COMPLETER}). Open a new form to
            fill out when you are ready.
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-stretch sm:items-end">
          <Button type="button" size="lg" className="gap-2" onClick={() => router.push("/coach/complete")}>
            <FileEdit className="h-4 w-4" />
            Complete a Form
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between gap-4 px-4 py-3">
          <p className="text-sm font-medium text-foreground">Your completed forms</p>
          <div className="relative w-56">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-8 text-sm"
            />
          </div>
        </div>

        <div className="h-4" />

        <div className="-mx-2 max-w-full min-w-0 overflow-x-auto px-2">
          <Table className="w-full min-w-[720px] table-auto">
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-[28%] min-w-[8rem] max-w-[16rem] py-4 font-semibold text-foreground">
                  Form name
                </TableHead>
                <TableHead className="min-w-[6rem] max-w-[10rem] py-4 font-semibold text-foreground">
                  Category
                </TableHead>
                <TableHead className="min-w-[6rem] max-w-[10rem] py-4 font-semibold text-foreground">
                  About
                </TableHead>
                <TableHead className="w-[7.5rem] min-w-[7.5rem] py-4 font-semibold text-foreground">
                  Completed
                </TableHead>
                <TableHead className="w-[8.5rem] min-w-[8.5rem] py-4 font-semibold text-foreground">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-16 text-center text-sm text-muted-foreground">
                    {search
                      ? "No forms match your search."
                      : "You have no completed forms yet. Use Complete a Form to get started."}
                  </TableCell>
                </TableRow>
              )}
              {paginated.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="min-w-0 max-w-[16rem] overflow-hidden py-5 align-middle whitespace-normal font-medium text-foreground">
                    <span className="block truncate" title={row.formName}>
                      {row.formName}
                    </span>
                  </TableCell>
                  <TableCell className="min-w-0 max-w-[10rem] overflow-hidden py-5 align-middle whitespace-normal text-sm text-muted-foreground">
                    <span className="block truncate" title={row.category}>
                      {row.category}
                    </span>
                  </TableCell>
                  <TableCell className="min-w-0 max-w-[10rem] overflow-hidden py-5 align-middle whitespace-normal text-sm text-muted-foreground">
                    <span className="block truncate" title={row.about}>
                      {row.about}
                    </span>
                  </TableCell>
                  <TableCell className="w-[7.5rem] min-w-[7.5rem] overflow-hidden py-5 align-middle whitespace-nowrap text-sm text-muted-foreground">
                    {row.completedAt}
                  </TableCell>
                  <TableCell className="min-w-0 overflow-hidden py-5 align-middle whitespace-nowrap">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                        row.status === "Submitted"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
                          : "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-400"
                      )}
                    >
                      {row.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <p className="text-xs text-muted-foreground">
            {filtered.length === 0
              ? "No results"
              : `${firstItem}–${lastItem} of ${filtered.length} form${filtered.length !== 1 ? "s" : ""}`}
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Rows per page</span>
              <Select
                value={String(pageSize)}
                onValueChange={(val) => {
                  setPageSize(Number(val));
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-7 w-16 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 25].map((n) => (
                    <SelectItem key={n} value={String(n)} className="text-xs">
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-40"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="min-w-[5rem] text-center text-xs text-muted-foreground">
                Page {safePage} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-40"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 px-1">
        <Link href="/" className={cn(buttonVariants({ variant: "link" }), "h-auto p-0 text-sm")}>
          ← Back To Admin Demo
        </Link>
      </div>
    </div>
  );
}
