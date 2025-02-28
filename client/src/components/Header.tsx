import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export default function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4 sm:px-8">
        <Link href="/">
          <a className="mr-6 flex items-center space-x-2">
            <span className="font-playfair text-xl font-bold">GyanGita</span>
          </a>
        </Link>
        
        <nav className="flex flex-1 items-center justify-between space-x-4 md:justify-end">
          <div className="flex items-center space-x-4">
            <Link href="/browse">
              <a className="text-sm font-medium transition-colors hover:text-primary">
                Browse
              </a>
            </Link>
            <Link href="/about">
              <a className="text-sm font-medium transition-colors hover:text-primary">
                About
              </a>
            </Link>
            <Link href="/contact">
              <a className="text-sm font-medium transition-colors hover:text-primary">
                Contact
              </a>
            </Link>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </nav>
      </div>
    </header>
  );
}
