"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

type Theme = "dark" | "light";

export default function ThemeToggle() {
    // null until mounted, so the server/client initial render match (the actual
    // theme is applied by the no-FOUC script before hydration).
    const [theme, setTheme] = useState<Theme | null>(null);

    useEffect(() => {
        setTheme(document.documentElement.classList.contains("light") ? "light" : "dark");
    }, []);

    function toggle() {
        const next: Theme = theme === "light" ? "dark" : "light";
        document.documentElement.classList.toggle("light", next === "light");
        try { localStorage.setItem("theme", next); } catch { /* ignore */ }
        setTheme(next);
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
