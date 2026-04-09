"use client"

import { useState, type ReactNode } from "react"
import {
  CircleDot, ChevronDown, CheckSquare, Calendar,
  Type, AlignLeft, Hash, Clock, PenLine,
  Plus, X,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface ComponentType {
  id: string
  name: string
  description: string
  icon: React.ElementType
  iconBg: string
  iconColor: string
}

interface ComponentGroup {
  title: string
  subtitle: string
  items: ComponentType[]
}

export const COMPONENT_COLORS: Record<string, { bg: string; text: string }> = {
  radio:          { bg: "bg-blue-200",   text: "text-blue-700" },   // 5.87:1 ✅
  dropdown:       { bg: "bg-indigo-200", text: "text-indigo-700" }, // 6.04:1 ✅
  "checkbox-set": { bg: "bg-amber-200",  text: "text-amber-800" },  // 5.93:1 ✅
  date:           { bg: "bg-orange-200", text: "text-orange-700" }, // 5.98:1 ✅
  "text-field":   { bg: "bg-rose-200",   text: "text-rose-700" },   // 6.82:1 ✅
  "text-area":    { bg: "bg-teal-200",   text: "text-teal-600" },   // 5.48:1 ✅
  number:         { bg: "bg-cyan-200",   text: "text-cyan-700" },   // 5.87:1 ✅
  duration:       { bg: "bg-slate-200",  text: "text-slate-600" },  // 5.28:1 ✅
  attachment:     { bg: "bg-green-200",  text: "text-green-700" },  // 6.16:1 ✅
  rubric:         { bg: "bg-violet-200", text: "text-violet-600" }, // 5.46:1 ✅
  "table-grid":   { bg: "bg-sky-200",    text: "text-sky-600" },    // 5.65:1 ✅
  "text-editor":  { bg: "bg-blue-100",   text: "text-blue-600" },   // 4.83:1 ✅
}

const COMPONENT_GROUPS: ComponentGroup[] = [
  {
    title: "Selection Option Components",
    subtitle: "Allow users to select from options.",
    items: [
      {
        id: "radio",
        name: "Radio Set",
        description: "Choose one item from a set of radio inputs.",
        icon: CircleDot,
        iconBg: "bg-blue-200",
        iconColor: "text-blue-700",
      },
      {
        id: "dropdown",
        name: "Select Menu",
        description: "Choose one item from a select menu.",
        icon: ChevronDown,
        iconBg: "bg-indigo-200",
        iconColor: "text-indigo-700",
      },
      {
        id: "checkbox-set",
        name: "Checkbox Set",
        description: "Choose multiple items from a set of checkboxes.",
        icon: CheckSquare,
        iconBg: "bg-amber-200",
        iconColor: "text-amber-800",
      },
      {
        id: "date",
        name: "Date Picker",
        description: "Gather the date data from the user.",
        icon: Calendar,
        iconBg: "bg-orange-200",
        iconColor: "text-orange-700",
      },
    ],
  },
  {
    title: "Gather Information Components",
    subtitle: "Allow users to fill out a field.",
    items: [
      {
        id: "text-field",
        name: "Text Field",
        description: "Gather a small line of text and numbers from a user.",
        icon: Type,
        iconBg: "bg-rose-200",
        iconColor: "text-rose-700",
      },
      {
        id: "text-area",
        name: "Text Area",
        description: "Gather a large amount of text from a user.",
        icon: AlignLeft,
        iconBg: "bg-teal-200",
        iconColor: "text-teal-600",
      },
      {
        id: "number",
        name: "Number Field",
        description: "Gather only numeric data from a user.",
        icon: Hash,
        iconBg: "bg-cyan-200",
        iconColor: "text-cyan-700",
      },
      {
        id: "duration",
        name: "Duration",
        description: "Gather duration in hours and minutes.",
        icon: Clock,
        iconBg: "bg-slate-200",
        iconColor: "text-slate-600",
      },
      // {
      //   id: "attachment",
      //   name: "Add Attachment",
      //   description: "Gather videos, files, goals, or completed data forms or observations.",
      //   icon: Paperclip,
      //   iconBg: "bg-green-200",
      //   iconColor: "text-green-700",
      // },
    ],
  },
  {
    title: "Provide Information Components",
    subtitle: "Allow users to read information.",
    items: [
      {
        id: "text-editor",
        name: "Text Editor",
        description: "Add information to a section. It does not gather data from the user.",
        icon: PenLine,
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600", // 4.83:1 ✅
      },
    ],
  },
]

interface ComponentPickerProps {
  onSelect: (type: string, name: string) => void
  children?: ReactNode
}

export function ComponentPicker({ onSelect, children }: ComponentPickerProps) {
  const [open, setOpen] = useState(false)

  function handleSelect(type: string, name: string) {
    onSelect(type, name)
    setOpen(false)
  }

  const trigger = children ? (
    <div onClick={() => setOpen(true)}>{children}</div>
  ) : (
    <Button size="sm" onClick={() => setOpen(true)}>
      <Plus />
      Add Component
    </Button>
  )

  return (
    <>
      {trigger}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />

          {/* Modal */}
          <div className="relative z-10 w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-lg border border-border overflow-hidden">

            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-border px-4 py-5 shrink-0 sm:px-8 sm:py-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Add a Component</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Pick a component to add to your form.
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto">
              <div className="flex flex-col divide-y divide-border sm:grid sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
                {COMPONENT_GROUPS.map((group) => (
                  <div key={group.title} className="flex flex-col gap-3 p-4 sm:gap-4 sm:p-6">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{group.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{group.subtitle}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-1 sm:flex sm:flex-col">
                      {group.items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleSelect(item.id, item.name)}
                          className="flex items-center gap-3 rounded-xl p-3 text-left hover:bg-muted/60 transition-colors group sm:items-start"
                        >
                          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:mt-0.5 sm:h-10 sm:w-10 ${item.iconBg}`}>
                            <item.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${item.iconColor}`} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground leading-snug group-hover:text-primary transition-colors">
                              {item.name}
                            </p>
                            <p className="hidden text-xs text-muted-foreground mt-0.5 leading-snug sm:block">
                              {item.description}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end border-t border-border px-4 py-4 shrink-0 sm:px-8">
              <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
