import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Search, Globe } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useSearch } from "@/hooks/use-search";
import { useLanguage } from "@/contexts/language-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Search overlay component with results display
function SearchOverlay() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: searchResults, isLoading } = useSearch(searchQuery);
  const { t } = useLanguage();

  return (
    <SheetContent side="top" className="h-[80vh] bg-background/95 backdrop-blur">
      <SheetHeader>
        <SheetTitle>{t('search.title')}</SheetTitle>
        <SheetDescription>
          {t('search.description')}
        </SheetDescription>
      </SheetHeader>
      <div className="mt-8">
        <Input
          type="search"
          placeholder={t('search.placeholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-12 text-lg"
        />

        <div className="mt-6">
          {isLoading ? (
            <div className="text-center text-muted-foreground">
              {t('search.loading')}...
            </div>
          ) : searchResults?.length ? (
            <div className="space-y-4">
              {searchResults.map((result, index) => (
                <Link 
                  key={index}
                  href={`/browse?chapter=${result.chapter}&verse=${result.verse}`}
                >
                  <a className="block p-4 rounded-lg hover:bg-muted transition-colors">
                    <div className="font-medium">
                      Chapter {result.chapter}, Verse {result.verse}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {result.preview}
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          ) : searchQuery && (
            <div className="text-center text-muted-foreground">
              {t('search.no_results')}
            </div>
          )}
        </div>
      </div>
    </SheetContent>
  );
}

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-4 sm:px-8">
        <Link href="/">
          <a className="flex items-center space-x-2">
            <span className="font-playfair text-xl font-bold">GyanGita</span>
          </a>
        </Link>

        <nav className="flex items-center space-x-6">
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/browse">
              <a className="text-sm font-medium transition-colors hover:text-primary">
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

            {/* Search Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Search className="h-5 w-5" />
                  <span className="sr-only">{t('nav.search')}</span>
                </Button>
              </SheetTrigger>
              <SearchOverlay />
            </Sheet>

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