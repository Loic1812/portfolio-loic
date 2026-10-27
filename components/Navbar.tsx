"use client";

import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import ThemeToggle from "./ThemeToggle";

const LINKS = [
  { href: "#skills", label: "Compétences" },
  { href: "#projects", label: "Projets" },
  { href: "#github", label: "GitHub" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar({ shortName }: { shortName: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line/70 bg-bg/75 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <a href="#top" className="flex items-center gap-2 text-sm font-semibold tracking-tight">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent font-mono text-xs text-accent-fg">
            L
          </span>
          {shortName}
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navigation principale">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-1.5 text-sm text-muted transition-colors hover:text-fg"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface text-muted md:hidden"
          >
            {open ? <FiX className="h-4 w-4" /> : <FiMenu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line bg-bg px-5 py-3 md:hidden" aria-label="Menu mobile">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-md px-2 py-2.5 text-sm text-muted hover:text-fg"
            >
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
