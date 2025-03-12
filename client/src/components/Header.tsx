import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Globe, Menu, Home, Bookmark, Book, Info, Mail } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useLanguage } from "@/contexts/language-context";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OmLogo } from "./icons/OmLogo";

const NAV_ITEMS = [
  { href: "/", icon: <Home className="h-4 w-4" />, key: 'nav.home' },
  { href: "/browse", icon: <Book className="h-4 w-4" />, key: 'nav.browse' },
  { href: "/bookmarks", icon: <Bookmark className="h-4 w-4" />, key: 'nav.bookmarks' },
  { href: "/about", icon: <Info className="h-4 w-4" />, key: 'nav.about' },
  { href: "/contact", icon: <Mail className="h-4 w-4" />, key: 'nav.contact' }
];

function MobileMenu() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden relative"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <nav className="flex flex-col mt-8">
          <AnimatePresence>
            {NAV_ITEMS.map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start mb-2 gap-3"
                  onClick={() => setIsOpen(false)}
                >
                  <Link href={item.href} className="flex items-center gap-3">
                    {item.icon}
                    <span className="font-medium">{t(item.key)}</span>
                  </Link>
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const brandTitle = language === 'hi' ? 'ज्ञानगीता' : 'GyanGita';

  return (
    <motion.header
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MobileMenu />
          <Link href="/">
            <Button variant="ghost" className="gap-2 px-0">
              <motion.div
                className="flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <OmLogo className="h-8 w-8 text-primary" />
                <motion.span
                  key={brandTitle}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-playfair text-xl font-bold leading-none hidden sm:block"
                >
                  {brandTitle}
                </motion.span>
              </motion.div>
            </Button>
          </Link>
        </div>

        <nav className="flex items-center gap-2 md:gap-1">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className="relative group px-4"
                >
                  <span className="flex items-center gap-2">
                    {item.icon}
                    <span className="font-medium">{t(item.key)}</span>
                  </span>
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                </Button>
              </Link>
            ))}
          </div>

          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-9 w-9"
                aria-label="Change language"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Globe className="h-5 w-5" />
                </motion.div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem onClick={() => setLanguage('en')} className="cursor-pointer">
                English {language === 'en' && '✓'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('hi')} className="cursor-pointer">
                हिंदी {language === 'hi' && '✓'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center"
            >
              <AnimatePresence mode="wait">
                {theme === "dark" ? (
                  <motion.div
                    key="moon"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="sun"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </Button>
        </nav>
      </div>
    </motion.header>
  );
}