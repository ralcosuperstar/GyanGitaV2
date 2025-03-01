import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Search, Globe, X, Menu, ChevronRight } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useSearch } from "@/hooks/use-search";
import { useLanguage } from "@/contexts/language-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

// Search result modal component
function SearchResultModal({ result, onClose }: { 
  result: any; 
  onClose: () => void;
}) {
  const { t } = useLanguage();

  if (!result?.content) return null;

  return (
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle>
          Chapter {result.chapter}, {result.type === 'chapter' ? 'Overview' : `Verse ${result.verse}`}
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2 text-primary">{t('verse.sanskrit')}</h3>
          <p className="text-xl font-sanskrit bg-muted/50 p-4 rounded-lg">{result.content.slok}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2 text-primary">{t('verse.transliteration')}</h3>
          <p className="text-lg bg-muted/50 p-4 rounded-lg">{result.content.transliteration}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2 text-primary">{t('verse.translation')}</h3>
          <p className="text-lg bg-muted/50 p-4 rounded-lg">{result.content.translation}</p>
        </div>
      </div>
    </DialogContent>
  );
}

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
          <Link href="/browse" onClick={() => setIsOpen(false)}>
            <a className="block py-2 px-4 hover:bg-muted rounded-md transition-colors">
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

// Search overlay component with instant results
function SearchOverlay() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: searchResults, isLoading } = useSearch(searchQuery);
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<any>(null);

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setSelectedResult(null);
    }
  }, [isOpen]);

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Search className="h-5 w-5" />
            <span className="sr-only">{t('nav.search')}</span>
          </Button>
        </SheetTrigger>
        <SheetContent 
          side="top" 
          className="h-[80vh] bg-background/95 backdrop-blur p-0 border-none"
        >
          <div className="container mx-auto max-w-3xl">
            <div className="relative">
              <div className="sticky top-0 bg-background/95 backdrop-blur py-4 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder={t('search.placeholder')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-12 pl-10 pr-4 text-lg w-full bg-muted/50"
                      autoFocus
                    />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsOpen(false)}
                    className="h-12 w-12"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="mt-4 px-4">
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="p-4 rounded-lg border">
                        <Skeleton className="h-6 w-1/3 mb-2" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    ))}
                  </div>
                ) : searchResults?.length ? (
                  <div className="divide-y">
                    {searchResults.map((result, index) => (
                      <div 
                        key={index}
                        className={cn(
                          "block p-4 -mx-4 transition-colors cursor-pointer",
                          "hover:bg-muted/50 focus:bg-muted/50 outline-none"
                        )}
                        onClick={() => setSelectedResult(result)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-lg">
                              Chapter {result.chapter}, {result.type === 'chapter' ? 'Overview' : `Verse ${result.verse}`}
                            </div>
                            <div className="text-muted-foreground mt-1 line-clamp-2">
                              {result.preview}
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : searchQuery ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {t('search.no_results')}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {t('search.start_typing')}
                  </div>
                )}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={!!selectedResult} onOpenChange={() => setSelectedResult(null)}>
        <SearchResultModal 
          result={selectedResult} 
          onClose={() => setSelectedResult(null)} 
        />
      </Dialog>
    </>
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

            {/* Search Overlay */}
            <SearchOverlay />

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