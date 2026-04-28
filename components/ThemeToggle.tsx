"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-9 h-9 rounded-lg"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-slate-400 hover:text-slate-200 transition" />
      ) : (
        <Moon className="w-4 h-4 text-slate-500 hover:text-slate-700 transition" />
      )}
    </Button>
  );
}