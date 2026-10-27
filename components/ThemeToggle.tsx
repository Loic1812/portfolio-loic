"use client";

import { FiMoon, FiSun } from "react-icons/fi";

export default function ThemeToggle() {
  const toggle = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch {
      /* stockage indisponible : on ignore */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Basculer entre le thème clair et le thème sombre"
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface text-muted transition-colors hover:text-fg"
    >
      <FiSun className="hidden h-4 w-4 dark:block" aria-hidden />
      <FiMoon className="block h-4 w-4 dark:hidden" aria-hidden />
    </button>
  );
}
