import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Search, Globe, Menu, Home } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/language-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

// Content display dialog
function VerseDialog({ verse, onClose }: { verse: any; onClose: () => void }) {
  const { t } = useLanguage();

  if (!verse) return null;

  return (
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle>
          Chapter {verse.chapter}, Verse {verse.verse}
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2 text-primary">{t('verse.sanskrit')}</h3>
          <p className="text-xl font-sanskrit bg-muted/50 p-4 rounded-lg">{verse.slok}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2 text-primary">{t('verse.transliteration')}</h3>
          <p className="text-lg bg-muted/50 p-4 rounded-lg">{verse.transliteration}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2 text-primary">{t('verse.translation')}</h3>
          <p className="text-lg bg-muted/50 p-4 rounded-lg">{verse.tej.et}</p>
        </div>
        <Button 
          onClick={() => {
            const text = `${verse.slok}\n\n${verse.transliteration}\n\n${verse.tej.et}`;
            const url = window.location.origin;
            window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n\n' + url)}`, '_blank');
          }}
          className="w-full"
        >
          {t('verse.share')}
        </Button>
      </div>
    </DialogContent>
  );
}

// Quick search component
function QuickSearch() {
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const [selectedVerse, setSelectedVerse] = useState<string>("");
  const [showDialog, setShowDialog] = useState(false);
  const { t } = useLanguage();

  const { data: chapters } = useQuery({
    queryKey: ['/api/chapters'],
    queryFn: async () => {
      const response = await fetch('https://vedicscriptures.github.io/chapters');
      if (!response.ok) throw new Error('Failed to fetch chapters');
      return response.json();
    }
  });

  const { data: verse } = useQuery({
    queryKey: ['/api/verse', selectedChapter, selectedVerse],
    queryFn: async () => {
      if (!selectedChapter || !selectedVerse) return null;
      const response = await fetch(`https://vedicscriptures.github.io/slok/${selectedChapter}/${selectedVerse}`);
      if (!response.ok) throw new Error('Failed to fetch verse');
      return response.json();
    },
    enabled: !!(selectedChapter && selectedVerse)
  });

  const selectedChapterData = chapters?.find(
    (c: any) => c.chapter_number.toString() === selectedChapter
  );

  return (
    <>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <VerseDialog verse={verse} onClose={() => setShowDialog(false)} />
      </Dialog>

      <div className="flex items-center gap-2">
        <Select value={selectedChapter} onValueChange={setSelectedChapter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('browse.select.chapter')} />
          </SelectTrigger>
          <SelectContent>
            {chapters?.map((chapter: any) => (
              <SelectItem 
                key={chapter.chapter_number} 
                value={chapter.chapter_number.toString()}
              >
                Ch {chapter.chapter_number}: {chapter.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedVerse}
          onValueChange={setSelectedVerse}
          disabled={!selectedChapter}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder={t('browse.select.verse')} />
          </SelectTrigger>
          <SelectContent>
            {selectedChapterData && Array.from(
              { length: selectedChapterData.verses_count },
              (_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()}>
                  Verse {i + 1}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          disabled={!selectedChapter || !selectedVerse}
          onClick={() => setShowDialog(true)}
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
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
            <QuickSearch />

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