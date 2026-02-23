"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Links() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Tasks" },
    { href: "/progress", label: "Progress" },
  ];

  return (
    <div className="flex items-center space-x-4 lg:space-x-6">
      {links.map(({ href, label }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`text-sm font-medium transition-colors ${isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
              }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
