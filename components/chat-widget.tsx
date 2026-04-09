"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X, Send, Bot } from "lucide-react";

interface Message {
  id: number;
  role: "assistant" | "user";
  text: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 0,
    role: "assistant",
    text: "Hi! I'm here to help with Insight Capture. Ask me anything about forms, responses, or how things work.",
  },
];

export function ChatWidget() {
  const pathname = usePathname();
  const isCaseStudy =
    pathname === "/" ||
    pathname === "/case-studies" ||
    pathname.startsWith("/case-studies/");

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  if (isCaseStudy) return null;

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { id: prev.length, role: "user", text },
      {
        id: prev.length + 1,
        role: "assistant",
        text: "Thanks for your message! This is a demo — a real assistant will be connected soon.",
      },
    ]);
    setInput("");
  }

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-20 left-4 right-4 z-50 flex flex-col rounded-2xl border border-border bg-white shadow-[0_20px_60px_-10px_rgba(0,0,0,0.22),0_8px_24px_-6px_rgba(0,0,0,0.12)] overflow-hidden sm:left-auto sm:right-6 sm:w-80">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 bg-primary px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white leading-tight">Help Assistant</p>
                <p className="text-[10px] text-white/70 leading-tight">Shaun Herron</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-md p-1 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex flex-col gap-3 overflow-y-auto p-4" style={{ maxHeight: 320 }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border p-3">
            <div className="flex items-center gap-2 rounded-xl border border-input bg-muted/40 px-3 py-2 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20 transition-all">
              <input
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                placeholder="Ask a question…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary text-primary-foreground disabled:opacity-40 disabled:pointer-events-none hover:bg-primary/90 active:bg-primary/80 transition-colors"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trigger button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90 active:bg-primary/80 active:scale-95 transition-all"
        aria-label="Open help chat"
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </button>
    </>
  );
}
