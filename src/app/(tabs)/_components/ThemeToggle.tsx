"use client";

import { useState, useSyncExternalStore } from "react";
import { Sun, Moon } from "lucide-react";

type Theme = "dark" | "light";

export default function ThemeToggle() {
    // The theme the no-FOUC script applied before hydration; null on the server so
    // the server and client first renders match.
    const applied = useSyncExternalStore(
        () => () => {},
        (): Theme => (document.documentElement.classList.contains("light") ? "light" : "dark"),
        () => null,
    );
    const [chosen, setChosen] = useState<Theme | null>(null);
    const theme = chosen ?? applied;

    function toggle() {
        const next: Theme = theme === "light" ? "dark" : "light";
        document.documentElement.classList.toggle("light", next === "light");
        try { localStorage.setItem("theme", next); } catch { /* ignore */ }
        setChosen(next);
    }

    return (
        <button
            onClick={toggle}
            aria-label="Toggle light and dark theme"
            title="Toggle theme"
            className="flex items-center justify-center w-9 h-9 rounded-md text-foreground/80 hover:text-highlight hover:cursor-pointer transition-colors"
        >
            {/* Shows the theme you'll switch TO. Defaults to Sun pre-mount. */}
            {theme === "light"
                ? <Moon className="w-5 h-5" />
                : <Sun className="w-5 h-5" />}
        </button>
    );
}
