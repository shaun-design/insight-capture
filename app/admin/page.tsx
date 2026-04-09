"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DRAFT_FORM_STORAGE_KEY,
  INSIGHTS_DRAFT_CHANGED_EVENT,
  dispatchInsightsDraftChanged,
  draftHasListableContent,
  readStoredDraftForm,
  type StoredDraftForm,
} from "@/lib/form-draft-storage";
import {
  readFormResponseDeltas,
  INSIGHTS_FORM_RESPONSE_DELTAS_EVENT,
  readCoachCompletionsRaw,
  deleteCoachCompletion,
  COACH_COMPLETIONS_CHANGED_EVENT,
} from "@/lib/coach-completions-storage";
import {
  INSTRUCTIONAL_WALKTHROUGH_FORM_ID,
  INSTRUCTIONAL_WALKTHROUGH_FORM_LIST_LABEL,
} from "@/lib/instructional-walkthrough-instrument";
import {
  mergeInitialFormsWithStatusOverrides,
  resolveFormStatus,
  setFormStatusOverride,
  removeFormStatusOverride,
  INSIGHTS_FORM_STATUS_OVERRIDES_EVENT,
} from "@/lib/insights-form-status-storage";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MoreHorizontal,
  Pencil,
  Eye,
  Send,
  Archive,
  ArchiveRestore,
  RotateCcw,
  CalendarX2,
  Trash2,
  Plus,
  Play,
  FileEdit,
  Search,
  ChevronLeft,
  ChevronRight,
  Columns3,
  ChevronDown,
} from "lucide-react";

type Status = "Draft" | "Published" | "Archived" | "Scheduled";
type ColumnKey = "category" | "owner" | "lastUpdated" | "status" | "responses" | "assignedTo";
type AdminMainTab = "templates" | "completions";

interface DataForm {
  id: string;
  name: string;
  purpose: string;
  owner: string;
  lastUpdated: string;
  status: Status;
  responses: number;
  assignedTo: string;
  /** Draft row persisted from authoring (localStorage); same id for the life of that draft */
  isLocalDraft?: boolean;
  /** Links this row to a completion template (`/forms/complete?template=`) */
  completionTemplateId?: string;
}

function storedDraftToTableRow(raw: StoredDraftForm): DataForm | null {
  if (!raw.id || !draftHasListableContent(raw)) return null;
  const updated = raw.updatedAt ? new Date(raw.updatedAt) : new Date();
  const lastUpdated = updated.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const audience = Array.isArray(raw.audience) ? raw.audience : [];
  const category = raw.category != null && String(raw.category).trim() ? String(raw.category) : "—";
  return {
    id: raw.id,
    name: (raw.title ?? "").trim() || "Untitled form",
    purpose: category,
    owner: "You",
    lastUpdated,
    status: resolveFormStatus(raw.id, "Draft"),
    responses: 0,
    assignedTo: audience.length > 0 ? audience.join(", ") : "—",
    isLocalDraft: true,
  };
}

const initialForms: DataForm[] = [
  {
    id: INSTRUCTIONAL_WALKTHROUGH_FORM_ID,
    name: INSTRUCTIONAL_WALKTHROUGH_FORM_LIST_LABEL,
    purpose: "Coaching",
    owner: "Sarah Mitchell",
    lastUpdated: "Apr 8, 2026",
    status: "Published",
    responses: 0,
    assignedTo: "Coaches",
    completionTemplateId: INSTRUCTIONAL_WALKTHROUGH_FORM_ID,
  },
  {
    id: "1",
    name: "Classroom Observation",
    purpose: "Classroom Observations",
    owner: "Sarah Mitchell",
    lastUpdated: "Apr 2, 2026",
    status: "Published",
    responses: 47,
    assignedTo: "All Teachers",
    completionTemplateId: "classroom-observation",
  },
  {
    id: "2",
    name: "Student Behavior Log",
    purpose: "Behavior Tracking",
    owner: "James Carter",
    lastUpdated: "Mar 28, 2026",
    status: "Published",
    responses: 23,
    assignedTo: "Coaches, Teachers",
    completionTemplateId: "behavior-incident",
  },
  {
    id: "3",
    name: "Grant Reporting Form",
    purpose: "Grant Documentation",
    owner: "Sarah Mitchell",
    lastUpdated: "Mar 15, 2026",
    status: "Draft",
    responses: 0,
    assignedTo: "Admins",
  },
  {
    id: "4",
    name: "Coaching Session Notes",
    purpose: "Coaching",
    owner: "James Carter",
    lastUpdated: "Apr 1, 2026",
    status: "Scheduled",
    responses: 31,
    assignedTo: "Coaches",
    completionTemplateId: "coaching-check-in",
  },
  {
    id: "5",
    name: "Attendance Intervention",
    purpose: "Attendance",
    owner: "Maria Gonzalez",
    lastUpdated: "Feb 20, 2026",
    status: "Archived",
    responses: 12,
    assignedTo: "Teachers",
  },
  {
    id: "6",
    name: "EOY Staff Survey",
    purpose: "Reporting",
    owner: "Maria Gonzalez",
    lastUpdated: "Jan 10, 2026",
    status: "Archived",
    responses: 64,
    assignedTo: "All Staff",
  },
];

const statusConfig: Record<Status, { label: string; className: string }> = {
  Draft: {
    label: "Draft",
    className: "bg-muted text-muted-foreground hover:bg-muted border-transparent",
  },
  Published: {
    label: "Published",
    className:
      "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-transparent dark:bg-emerald-950 dark:text-emerald-400",
  },
  Archived: {
    label: "Archived",
    className:
      "bg-muted/50 text-muted-foreground/70 hover:bg-muted/50 border-transparent",
  },
  Scheduled: {
    label: "Scheduled",
    className:
      "bg-blue-100 text-blue-700 hover:bg-blue-100 border-transparent dark:bg-blue-950 dark:text-blue-400",
  },
};


const ownerPhotos: Record<string, string> = {
  "Sarah Mitchell": "/sarah.jpg",
  "James Carter": "/james.jpg",
  "Maria Gonzalez": "/maria.jpg",
};

function OwnerAvatar({ name }: { name: string }) {
  const photo = ownerPhotos[name];
  return (
    <div className="flex min-w-0 max-w-full items-center gap-2">
      {photo ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={photo}
          alt=""
          width={28}
          height={28}
          className="h-7 w-7 shrink-0 rounded-full object-cover"
          aria-hidden
        />
      ) : (
        <div
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground"
          aria-hidden
        >
          {name.trim().slice(0, 1).toUpperCase() || "?"}
        </div>
      )}
      <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground" title={name}>
        {name}
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status];
  return (
    <Badge className={config.className} variant="outline">
      {config.label}
    </Badge>
  );
}

const ALL_FILTER = "All";
const statusFilters = [ALL_FILTER, "Published", "Draft", "Scheduled", "Archived"] as const;
type FilterValue = (typeof statusFilters)[number];

const CONFIRM_COPY = {
  unpublish: {
    title: "Unpublish this form?",
    message:
      "It will no longer accept new responses. Existing responses will remain saved and accessible.",
    confirmLabel: "Unpublish",
  },
  archive: {
    title: "Archive this form?",
    message:
      "It will no longer be available for use. Existing responses will remain saved and accessible.",
    confirmLabel: "Archive",
  },
} as const;

type ConfirmAction = keyof typeof CONFIRM_COPY;

function adminCompleteHref(completionTemplateId: string) {
  return `/forms/complete?template=${encodeURIComponent(completionTemplateId)}`;
}

function ConfirmDialog({
  action,
  onConfirm,
  onCancel,
}: {
  action: ConfirmAction;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const copy = CONFIRM_COPY[action];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg border border-border">
        <h2 className="text-base font-semibold text-foreground">{copy.title}</h2>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{copy.message}</p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={onConfirm}
          >
            {copy.confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ActionsMenu({
  form,
  onStatusChange,
  onDelete,
  onRequestConfirm,
}: {
  form: DataForm;
  onStatusChange: (id: string, status: Status) => void;
  onDelete: (id: string) => void;
  onRequestConfirm: (action: ConfirmAction, formId: string) => void;
}) {
  const router = useRouter();
  const template = form.completionTemplateId;

  function goEditPublished() {
    if (template) {
      router.push(`/forms/new?editTemplate=${encodeURIComponent(template)}`);
    } else {
      router.push("/forms/new");
    }
  }

  function goViewPublished() {
    if (template) {
      router.push(adminCompleteHref(template));
    } else {
      router.push("/forms/new/preview?source=insights");
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none">
        <MoreHorizontal className="h-4 w-4" />
        <span className="sr-only">Open actions</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">

        {form.status === "Draft" && (
          <>
            {form.isLocalDraft ? (
              <DropdownMenuItem onClick={() => router.push("/forms/new")}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => router.push("/forms/new")}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onStatusChange(form.id, "Published")}>
              <Send className="mr-2 h-4 w-4" />
              Publish
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => onDelete(form.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </>
        )}

        {form.status === "Published" && (
          <>
            {template ? (
              <DropdownMenuItem onClick={() => router.push(adminCompleteHref(template))}>
                <FileEdit className="mr-2 h-4 w-4" />
                Complete Form
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuItem onClick={goEditPublished}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={goViewPublished}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onRequestConfirm("unpublish", form.id)}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Unpublish
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onRequestConfirm("archive", form.id)}>
              <Archive className="mr-2 h-4 w-4" />
              Archive
            </DropdownMenuItem>
          </>
        )}

        {form.status === "Archived" && (
          <>
            <DropdownMenuItem onClick={goViewPublished}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onStatusChange(form.id, "Published")}>
              <ArchiveRestore className="mr-2 h-4 w-4" />
              Unarchive
            </DropdownMenuItem>
          </>
        )}

        {form.status === "Scheduled" && (
          <>
            {template ? (
              <DropdownMenuItem onClick={() => router.push(adminCompleteHref(template))}>
                <FileEdit className="mr-2 h-4 w-4" />
                Complete Form
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuItem onClick={goViewPublished}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={goEditPublished}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onStatusChange(form.id, "Draft")}>
              <CalendarX2 className="mr-2 h-4 w-4" />
              Unschedule
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange(form.id, "Published")}>
              <Send className="mr-2 h-4 w-4" />
              Publish Now
            </DropdownMenuItem>
          </>
        )}

      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function DataFormsPage() {
  const [forms, setForms] = useState<DataForm[]>(initialForms);
  const [responseDeltas, setResponseDeltas] = useState<Record<string, number>>({});
  const [localDraftRow, setLocalDraftRow] = useState<DataForm | null>(null);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterValue>(ALL_FILTER);
  const [ownerFilter, setOwnerFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [pendingConfirm, setPendingConfirm] = useState<{ action: ConfirmAction; formId: string } | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<Record<ColumnKey, boolean>>({
    category: true,
    owner: true,
    lastUpdated: true,
    status: true,
    responses: true,
    assignedTo: true,
  });
  const [adminMainTab, setAdminMainTab] = useState<AdminMainTab>("templates");
  const [completionsSearch, setCompletionsSearch] = useState("");
  const [completionsPage, setCompletionsPage] = useState(1);
  const [completionsSync, setCompletionsSync] = useState(0);

  useEffect(() => {
    function syncFormsFromStatusOverrides() {
      setForms(mergeInitialFormsWithStatusOverrides(initialForms));
    }
    syncFormsFromStatusOverrides();
    window.addEventListener("storage", syncFormsFromStatusOverrides);
    return () => {
      window.removeEventListener("storage", syncFormsFromStatusOverrides);
    };
  }, []);

  useEffect(() => {
    function syncLocalDraft() {
      const raw = readStoredDraftForm();
      setLocalDraftRow(raw ? storedDraftToTableRow(raw) : null);
    }
    syncLocalDraft();
    window.addEventListener(INSIGHTS_DRAFT_CHANGED_EVENT, syncLocalDraft);
    window.addEventListener(INSIGHTS_FORM_STATUS_OVERRIDES_EVENT, syncLocalDraft);
    window.addEventListener("storage", syncLocalDraft);
    return () => {
      window.removeEventListener(INSIGHTS_DRAFT_CHANGED_EVENT, syncLocalDraft);
      window.removeEventListener(INSIGHTS_FORM_STATUS_OVERRIDES_EVENT, syncLocalDraft);
      window.removeEventListener("storage", syncLocalDraft);
    };
  }, []);

  useEffect(() => {
    function syncDeltas() {
      setResponseDeltas(readFormResponseDeltas());
    }
    syncDeltas();
    window.addEventListener(INSIGHTS_FORM_RESPONSE_DELTAS_EVENT, syncDeltas);
    window.addEventListener("storage", syncDeltas);
    return () => {
      window.removeEventListener(INSIGHTS_FORM_RESPONSE_DELTAS_EVENT, syncDeltas);
      window.removeEventListener("storage", syncDeltas);
    };
  }, []);

  useEffect(() => {
    function bumpCompletions() {
      setCompletionsSync((n) => n + 1);
    }
    window.addEventListener(COACH_COMPLETIONS_CHANGED_EVENT, bumpCompletions);
    window.addEventListener("storage", bumpCompletions);
    return () => {
      window.removeEventListener(COACH_COMPLETIONS_CHANGED_EVENT, bumpCompletions);
      window.removeEventListener("storage", bumpCompletions);
    };
  }, []);

  const formsWithResponseDeltas = useMemo(
    () =>
      forms.map((f) => ({
        ...f,
        responses: f.responses + (responseDeltas[f.id] ?? 0),
      })),
    [forms, responseDeltas]
  );

  const allForms = useMemo(() => {
    if (!localDraftRow) return formsWithResponseDeltas;
    const withoutDup = formsWithResponseDeltas.filter((f) => f.id !== localDraftRow.id);
    return [localDraftRow, ...withoutDup];
  }, [formsWithResponseDeltas, localDraftRow]);

  const ownerOptions = useMemo(() => Array.from(new Set(allForms.map((f) => f.owner))).sort(), [allForms]);
  const categoryOptions = useMemo(() => Array.from(new Set(allForms.map((f) => f.purpose))).sort(), [allForms]);

  const filtered = useMemo(() => {
    setPage(1);
    return allForms.filter((f) => {
      const matchesSearch =
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.owner.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        activeFilter === ALL_FILTER || f.status === activeFilter;
      const matchesOwner = ownerFilter === "all" || f.owner === ownerFilter;
      const matchesCategory = categoryFilter === "all" || f.purpose === categoryFilter;
      return matchesSearch && matchesStatus && matchesOwner && matchesCategory;
    });
  }, [allForms, search, activeFilter, ownerFilter, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const firstItem = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const lastItem = Math.min(safePage * pageSize, filtered.length);

  const completionsSorted = useMemo(() => {
    const rows = readCoachCompletionsRaw();
    return rows.sort(
      (a, b) => new Date(b.completedAtIso).getTime() - new Date(a.completedAtIso).getTime()
    );
  }, [completionsSync]);

  const completionsFiltered = useMemo(() => {
    const q = completionsSearch.toLowerCase().trim();
    if (!q) return completionsSorted;
    return completionsSorted.filter(
      (r) =>
        r.formName.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.about.toLowerCase().includes(q) ||
        r.completedBy.toLowerCase().includes(q)
    );
  }, [completionsSorted, completionsSearch]);

  const completionsTotalPages = Math.max(1, Math.ceil(completionsFiltered.length / pageSize));
  const completionsSafePage = Math.min(completionsPage, completionsTotalPages);
  const completionsPaginated = completionsFiltered.slice(
    (completionsSafePage - 1) * pageSize,
    completionsSafePage * pageSize
  );
  const completionsFirst =
    completionsFiltered.length === 0 ? 0 : (completionsSafePage - 1) * pageSize + 1;
  const completionsLast = Math.min(completionsSafePage * pageSize, completionsFiltered.length);

  function handleAdminMainTab(next: AdminMainTab) {
    setAdminMainTab(next);
    setPage(1);
    setCompletionsPage(1);
  }

  function handleFilterChange(f: FilterValue) {
    setActiveFilter(f);
    setPage(1);
  }

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleStatusChange(id: string, status: Status) {
    setFormStatusOverride(id, status);
    setForms((prev) => prev.map((f) => (f.id === id ? { ...f, status } : f)));
  }

  function handleDelete(id: string) {
    removeFormStatusOverride(id);
    const draft = readStoredDraftForm();
    if (draft?.id === id) {
      localStorage.removeItem(DRAFT_FORM_STORAGE_KEY);
      setLocalDraftRow(null);
      dispatchInsightsDraftChanged();
      return;
    }
    setForms((prev) => prev.filter((f) => f.id !== id));
  }

  function handleRequestConfirm(action: ConfirmAction, formId: string) {
    setPendingConfirm({ action, formId });
  }

  function handleConfirm() {
    if (!pendingConfirm) return;
    const { action, formId } = pendingConfirm;
    const nextStatus: Status = action === "unpublish" ? "Draft" : "Archived";
    handleStatusChange(formId, nextStatus);
    setPendingConfirm(null);
  }

  return (
    <div>
      {pendingConfirm && (
        <ConfirmDialog
          action={pendingConfirm.action}
          onConfirm={handleConfirm}
          onCancel={() => setPendingConfirm(null)}
        />
      )}
      {/* Page header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl text-center sm:text-left">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Insight Capture
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Create and manage structured forms across your organization,
            including classroom observations, behavior logs, grant
            documentation, and coaching notes.
          </p>
        </div>
        <div className="inline-flex flex-col items-stretch gap-1.5 sm:items-end sm:shrink-0">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
            <Link
              href="/forms/complete"
              className={cn(buttonVariants({ variant: "outline", size: "default" }), "gap-2")}
            >
              <FileEdit />
              Complete a Form
            </Link>
            <Link
              href="/forms/new"
              className={cn(buttonVariants(), "gap-2")}
              onClick={() => {
                localStorage.removeItem(DRAFT_FORM_STORAGE_KEY);
                dispatchInsightsDraftChanged();
              }}
            >
              <Plus />
              Create New Form
            </Link>
          </div>
          <a
            href="#"
            className="flex items-center justify-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <Play className="h-3 w-3 shrink-0 fill-current" />
            Watch Video Tutorial
          </a>
        </div>
      </div>

      {/* Table card */}
      <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <div className="border-b border-border px-4 pt-5 sm:px-8 sm:pt-6">
          <div role="tablist" aria-label="Form library" className="flex gap-6">
            <button
              type="button"
              role="tab"
              aria-selected={adminMainTab === "templates"}
              onClick={() => handleAdminMainTab("templates")}
              className={cn(
                "relative pb-3 text-sm font-medium transition-colors",
                adminMainTab === "templates"
                  ? "text-foreground after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Form Templates
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={adminMainTab === "completions"}
              onClick={() => handleAdminMainTab("completions")}
              className={cn(
                "relative pb-3 text-sm font-medium transition-colors",
                adminMainTab === "completions"
                  ? "text-foreground after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Completed Forms
            </button>
          </div>
        </div>

        {adminMainTab === "templates" ? (
        <div className="px-4 pb-6 pt-4 sm:px-8 sm:pb-8">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Status filter tabs — scrollable strip on narrow screens */}
          <div className="-mx-1 overflow-x-auto">
            <div className="flex min-w-max items-center gap-1 px-1">
            {statusFilters.map((f) => (
              <button
                key={f}
                onClick={() => handleFilterChange(f)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeFilter === f
                    ? "bg-neutral-300 text-neutral-800"
                    : "text-neutral-500 hover:bg-neutral-200 hover:text-neutral-700"
                }`}
              >
                {f}
              </button>
            ))}
            </div>
          </div>

          {/* Search + columns */}
          <div className="flex items-center gap-2">
            <div className="relative min-w-0 flex-1 sm:w-56 sm:flex-none">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search forms…"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="h-8 w-full pl-8 text-sm"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2 shrink-0")}
              >
                <Columns3 className="h-4 w-4" />
                Columns
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 mr-1">
                <DropdownMenuCheckboxItem
                  checked={visibleColumns.category}
                  onCheckedChange={(checked) => setVisibleColumns((prev) => ({ ...prev, category: !!checked }))}
                >
                  Category
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={visibleColumns.owner}
                  onCheckedChange={(checked) => setVisibleColumns((prev) => ({ ...prev, owner: !!checked }))}
                >
                  Owner
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={visibleColumns.lastUpdated}
                  onCheckedChange={(checked) => setVisibleColumns((prev) => ({ ...prev, lastUpdated: !!checked }))}
                >
                  Last Updated
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={visibleColumns.status}
                  onCheckedChange={(checked) => setVisibleColumns((prev) => ({ ...prev, status: !!checked }))}
                >
                  Status
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={visibleColumns.responses}
                  onCheckedChange={(checked) => setVisibleColumns((prev) => ({ ...prev, responses: !!checked }))}
                >
                  Responses
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={visibleColumns.assignedTo}
                  onCheckedChange={(checked) => setVisibleColumns((prev) => ({ ...prev, assignedTo: !!checked }))}
                >
                  Assigned To
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="h-4" />

        {/* Table */}
        <div className="overflow-x-auto">
        <Table className="w-full table-fixed">
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="py-4 font-semibold text-foreground">
                Form Name
              </TableHead>
              {visibleColumns.category && (
                <TableHead className="hidden w-[12%] min-w-[6rem] max-w-[11rem] py-4 font-semibold text-foreground sm:table-cell">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 font-semibold text-foreground hover:text-primary transition-colors">
                      Category
                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-52">
                      <DropdownMenuRadioGroup value={categoryFilter} onValueChange={setCategoryFilter}>
                        <DropdownMenuRadioItem value="all">All categories</DropdownMenuRadioItem>
                        {categoryOptions.map((category) => (
                          <DropdownMenuRadioItem key={category} value={category}>
                            {category}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableHead>
              )}
              {visibleColumns.owner && (
                <TableHead className="hidden w-[14%] min-w-[7rem] max-w-[11rem] py-4 font-semibold text-foreground sm:table-cell">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 font-semibold text-foreground hover:text-primary transition-colors">
                      Owner
                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      <DropdownMenuRadioGroup value={ownerFilter} onValueChange={setOwnerFilter}>
                        <DropdownMenuRadioItem value="all">All owners</DropdownMenuRadioItem>
                        {ownerOptions.map((owner) => (
                          <DropdownMenuRadioItem key={owner} value={owner}>
                            {owner}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableHead>
              )}
              {visibleColumns.lastUpdated && (
                <TableHead className="hidden w-[7.5rem] py-4 font-semibold text-foreground sm:table-cell">
                  Last Updated
                </TableHead>
              )}
              {visibleColumns.status && (
                <TableHead className="w-28 py-4 font-semibold text-foreground">Status</TableHead>
              )}
              {visibleColumns.responses && (
                <TableHead className="hidden w-[5.5rem] py-4 text-right font-semibold text-foreground sm:table-cell">
                  Responses
                </TableHead>
              )}
              {visibleColumns.assignedTo && (
                <TableHead className="hidden py-4 font-semibold text-foreground sm:table-cell">
                  Assigned To
                </TableHead>
              )}
              <TableHead className="w-12 py-4" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={2 + Object.values(visibleColumns).filter(Boolean).length}
                  className="py-20 text-center text-sm text-muted-foreground"
                >
                  {search || activeFilter !== ALL_FILTER
                    ? "No forms match your search."
                    : "No forms yet. Create your first form to get started."}
                </TableCell>
              </TableRow>
            )}
            {paginated.map((form) => (
              <TableRow key={form.id} className="group">
                <TableCell className="overflow-hidden py-4 align-middle">
                  {form.isLocalDraft ? (
                    <Link
                      href="/forms/new"
                      className="block min-w-0 font-medium text-foreground transition-colors group-hover:text-primary"
                      title={form.name}
                    >
                      <span className="block truncate">{form.name}</span>
                    </Link>
                  ) : (
                    <span
                      className="block min-w-0 cursor-default font-medium text-foreground"
                      title={form.name}
                    >
                      <span className="block truncate">{form.name}</span>
                    </span>
                  )}
                  <span className="mt-0.5 block truncate text-xs text-muted-foreground sm:hidden">
                    {[form.owner, form.lastUpdated].filter(Boolean).join(" · ")}
                  </span>
                </TableCell>
                {visibleColumns.category && (
                  <TableCell className="hidden min-w-0 py-4 align-middle text-sm text-muted-foreground sm:table-cell">
                    <span className="block truncate" title={form.purpose}>
                      {form.purpose}
                    </span>
                  </TableCell>
                )}
                {visibleColumns.owner && (
                  <TableCell className="hidden min-w-0 py-4 align-middle sm:table-cell">
                    <OwnerAvatar name={form.owner} />
                  </TableCell>
                )}
                {visibleColumns.lastUpdated && (
                  <TableCell className="hidden w-[7.5rem] py-4 align-middle whitespace-nowrap text-sm text-muted-foreground sm:table-cell">
                    {form.lastUpdated}
                  </TableCell>
                )}
                {visibleColumns.status && (
                  <TableCell className="py-4 align-middle whitespace-nowrap">
                    <StatusBadge status={form.status} />
                  </TableCell>
                )}
                {visibleColumns.responses && (
                  <TableCell className="hidden w-[5.5rem] py-4 text-right align-middle whitespace-nowrap text-sm text-muted-foreground sm:table-cell">
                    {form.responses > 0 ? (
                      form.responses.toLocaleString()
                    ) : (
                      <span className="text-muted-foreground/40">—</span>
                    )}
                  </TableCell>
                )}
                {visibleColumns.assignedTo && (
                  <TableCell className="hidden min-w-0 py-4 align-middle text-sm text-muted-foreground sm:table-cell">
                    <span className="block truncate" title={form.assignedTo}>
                      {form.assignedTo}
                    </span>
                  </TableCell>
                )}
                <TableCell className="w-12 py-4 align-middle">
                  <ActionsMenu
                    form={form}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                    onRequestConfirm={handleRequestConfirm}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-border py-3">
          <p className="text-xs text-muted-foreground">
            {filtered.length === 0
              ? "No results"
              : `${firstItem}–${lastItem} of ${filtered.length} form${filtered.length !== 1 ? "s" : ""}`}
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="hidden text-xs text-muted-foreground sm:inline">Rows per page</span>
              <Select
                value={String(pageSize)}
                onValueChange={(val) => {
                  setPageSize(Number(val));
                  setPage(1);
                  setCompletionsPage(1);
                }}
              >
                <SelectTrigger className="h-7 w-16 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 25, 50].map((n) => (
                    <SelectItem key={n} value={String(n)} className="text-xs">
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent disabled:opacity-40 disabled:pointer-events-none transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="min-w-[5rem] text-center text-xs text-muted-foreground">
                Page {safePage} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent disabled:opacity-40 disabled:pointer-events-none transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        </div>
        ) : (
        <div className="px-4 pb-6 pt-4 sm:px-8 sm:pb-8">
          <div className="flex flex-col gap-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Submissions from coaches and admins who finished a form in this demo.
            </p>
            <div className="relative w-full sm:w-56">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search completed forms…"
                value={completionsSearch}
                onChange={(e) => {
                  setCompletionsSearch(e.target.value);
                  setCompletionsPage(1);
                }}
                className="h-8 pl-8 text-sm"
              />
            </div>
          </div>

          <div className="h-4" />

          <div className="overflow-x-auto">
            <Table className="w-full table-fixed">
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="py-4 font-semibold text-foreground">
                    Form name
                  </TableHead>
                  <TableHead className="hidden py-4 font-semibold text-foreground sm:table-cell">
                    Category
                  </TableHead>
                  <TableHead className="hidden py-4 font-semibold text-foreground sm:table-cell">
                    About
                  </TableHead>
                  <TableHead className="hidden py-4 font-semibold text-foreground sm:table-cell">
                    Completed by
                  </TableHead>
                  <TableHead className="hidden w-[7.5rem] py-4 font-semibold text-foreground sm:table-cell">
                    Completed
                  </TableHead>
                  <TableHead className="w-28 py-4 font-semibold text-foreground">
                    Status
                  </TableHead>
                  <TableHead className="w-10 py-4" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {completionsFiltered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="py-20 text-center text-sm text-muted-foreground">
                      {completionsSearch.trim()
                        ? "No completed forms match your search."
                        : "No completed forms yet. Use Complete a Form to submit one."}
                    </TableCell>
                  </TableRow>
                )}
                {completionsPaginated.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="overflow-hidden py-4 align-middle font-medium text-foreground">
                      <span className="block truncate" title={row.formName}>
                        {row.formName}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-muted-foreground sm:hidden">
                        {row.category} · {row.completedBy} · {new Date(row.completedAtIso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </TableCell>
                    <TableCell className="hidden overflow-hidden py-4 align-middle text-sm text-muted-foreground sm:table-cell">
                      <span className="block truncate" title={row.category}>
                        {row.category}
                      </span>
                    </TableCell>
                    <TableCell className="hidden overflow-hidden py-4 align-middle text-sm text-muted-foreground sm:table-cell">
                      <span className="block truncate" title={row.about}>
                        {row.about}
                      </span>
                    </TableCell>
                    <TableCell className="hidden overflow-hidden py-4 align-middle text-sm text-muted-foreground sm:table-cell">
                      <span className="block truncate" title={row.completedBy}>
                        {row.completedBy}
                      </span>
                    </TableCell>
                    <TableCell className="hidden w-[7.5rem] py-4 align-middle text-sm text-muted-foreground sm:table-cell">
                      {new Date(row.completedAtIso).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="py-4 align-middle">
                      <Badge
                        className="border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
                        variant="outline"
                      >
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="w-10 py-4 align-middle">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open actions</span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                              deleteCoachCompletion(row.id);
                              setCompletionsSync((n) => n + 1);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between border-t border-border py-3">
            <p className="text-xs text-muted-foreground">
              {completionsFiltered.length === 0
                ? "No results"
                : `${completionsFirst}–${completionsLast} of ${completionsFiltered.length} submission${completionsFiltered.length !== 1 ? "s" : ""}`}
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="hidden text-xs text-muted-foreground sm:inline">Rows per page</span>
                <Select
                  value={String(pageSize)}
                  onValueChange={(val) => {
                    setPageSize(Number(val));
                    setPage(1);
                    setCompletionsPage(1);
                  }}
                >
                  <SelectTrigger className="h-7 w-16 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 10, 25, 50].map((n) => (
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
                  onClick={() => setCompletionsPage((p) => Math.max(1, p - 1))}
                  disabled={completionsSafePage === 1}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-40"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="min-w-[5rem] text-center text-xs text-muted-foreground">
                  Page {completionsSafePage} of {completionsTotalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCompletionsPage((p) => Math.min(completionsTotalPages, p + 1))}
                  disabled={completionsSafePage === completionsTotalPages}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-40"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
