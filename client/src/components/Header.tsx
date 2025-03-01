import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Search, Globe, Menu, Home } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLanguage } from "@/contexts/language-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

// Mobile menu component
function MobileMenu() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col space-y-4 mt-8">
          <Link href="/" onClick={() => setIsOpen(false)}>
            <a className="block py-2 px-4 hover:bg-muted rounded-md transition-colors">
              <Home className="inline-block w-4 h-4 mr-2" />
              {t('nav.home')}
            </a>
          </Link>
          <Link href="/browse" onClick={() => setIsOpen(false)}>
            <a className="block py-2 px-4 bg-primary/5 hover:bg-primary/10 rounded-md transition-colors text-primary">
              <Search className="inline-block w-4 h-4 mr-2" />
              {t('nav.browse')}
            </a>
          </Link>
          <Link href="/about" onClick={() => setIsOpen(false)}>
            <a className="block py-2 px-4 hover:bg-muted rounded-md transition-colors">
              {t('nav.about')}
            </a>
          </Link>
          <Link href="/contact" onClick={() => setIsOpen(false)}>
            <a className="block py-2 px-4 hover:bg-muted rounded-md transition-colors">
              {t('nav.contact')}
            </a>
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center">
          <MobileMenu />
          <Link href="/">
            <a className="flex items-center space-x-2 ml-2 md:ml-0">
              <span className="font-playfair text-xl font-bold">GyanGita</span>
            </a>
          </Link>
        </div>

        <nav className="flex items-center space-x-6">
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/">
              <a className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-2">
                <Home className="h-4 w-4" />
                {t('nav.home')}
              </a>
            </Link>
            <Link href="/browse">
              <a className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-md text-primary">
                <Search className="h-4 w-4" />
                {t('nav.browse')}
              </a>
            </Link>
            <Link href="/about">
              <a className="text-sm font-medium transition-colors hover:text-primary">
                {t('nav.about')}
              </a>
            </Link>
            <Link href="/contact">
              <a className="text-sm font-medium transition-colors hover:text-primary">
                {t('nav.contact')}
              </a>
            </Link>
          </div>

          <div className="flex items-center space-x-2">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage('en')}>
                  English {language === 'en' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('hi')}>
                  हिंदी {language === 'hi' && '✓'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}