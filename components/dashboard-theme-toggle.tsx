"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function DashboardThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("phantasm-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialIsDark = savedTheme ? savedTheme === "dark" : prefersDark;

    queueMicrotask(() => {
      setIsDark(initialIsDark);
    });
    document.documentElement.classList.toggle("dashboard-light", !initialIsDark);
  }, []);

  function toggleTheme() {
    const nextIsDark = !isDark;
    setIsDark(nextIsDark);
    window.localStorage.setItem(
      "phantasm-theme",
      nextIsDark ? "dark" : "light",
    );
    document.documentElement.classList.toggle(
      "dashboard-light",
      !nextIsDark,
    );
  }

  return (
    <button
      className="dashboard-icon-button"
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={!isDark}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
