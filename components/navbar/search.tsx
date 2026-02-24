"use client";

import React from "react";
import { Search } from "lucide-react";
import { Button } from "../ui/button";

export default function SearchButton() {
  const trigger = () => {
    const e = new KeyboardEvent("keydown", {
      key: "k",
      metaKey: true,
      bubbles: true,
    });
    document.dispatchEvent(e);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={trigger}
      className="gap-2 text-muted-foreground md:w-[140px] lg:w-[200px] justify-start font-normal"
    >
      <Search className="h-3.5 w-3.5 shrink-0" />
      <span className="flex-1 text-left text-xs hidden md:block">Search…</span>
      <kbd className="hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
        <span className="text-[11px]">⌘</span>K
      </kbd>
    </Button>
  );
}
