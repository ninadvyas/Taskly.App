"use client";

import React from "react";
import { Search } from "lucide-react";

export default function SearchButton() {
  return (
    <button
      onClick={() => {
        // Trigger Cmd+K by dispatching a keyboard event
        const e = new KeyboardEvent("keydown", {
          key: "k",
          metaKey: true,
          bubbles: true,
        });
        document.dispatchEvent(e);
      }}
      className="flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm text-muted-foreground hover:bg-muted transition-colors md:w-[140px] lg:w-[200px]"
    >
      <Search className="h-3.5 w-3.5 shrink-0" />
      <span className="flex-1 text-left text-xs hidden md:block">Search…</span>
      <kbd className="hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
        <span className="text-[11px]">⌘</span>K
      </kbd>
    </button>
  );
}
