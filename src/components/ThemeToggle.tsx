
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="rounded-full transition-all duration-200 hover:bg-primary/10 relative"
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <Sun className={`h-5 w-5 absolute transition-all ${theme === 'light' ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} />
      <Moon className={`h-5 w-5 absolute transition-all ${theme === 'dark' ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'}`} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
