import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Search, Globe, Menu, Home, Bookmark } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useLanguage } from "@/contexts/language-context";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OmLogo } from "./icons/OmLogo";

function MobileMenu() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 100
      }
    })
  };

  const menuItems = [
    { href: "/", icon: <Home className="h-4 w-4" />, label: t('nav.home') },
    { href: "/browse", icon: <Search className="h-4 w-4" />, label: t('nav.browse') },
    { href: "/bookmarks", icon: <Bookmark className="h-4 w-4" />, label: t('nav.bookmarks') },
    { href: "/about", label: t('nav.about') },
    { href: "/contact", label: t('nav.contact') }
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col space-y-4 mt-8">
          <AnimatePresence>
            {menuItems.map((item, i) => (
              <motion.div
                key={item.href}
                custom={i}
                variants={menuItemVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, x: -20 }}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => setIsOpen(false)}
                >
                  <Link href={item.href}>
                    <div className="flex items-center">
                      {item.icon && <span className="mr-2">{item.icon}</span>}
                      {item.label}
                    </div>
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

  const navItemVariants = {
    hover: { scale: 1.05, transition: { type: "spring", stiffness: 400 } }
  };

  const brandTitle = language === 'hi' ? 'ज्ञानगीता' : 'GyanGita';

  return (
    <motion.header
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center">
          <MobileMenu />
          <Button
            variant="ghost"
            className="ml-2 md:ml-0"
            asChild
          >
            <Link href="/">
              <motion.div
                className="flex items-center space-x-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <OmLogo className="h-8 w-8 text-primary" />
                <motion.span
                  key={brandTitle}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-playfair text-xl font-bold leading-loose"
                >
                  {brandTitle}
                </motion.span>
              </motion.div>
            </Link>
          </Button>
        </div>

        <nav className="flex items-center space-x-6">
          <div className="hidden md:flex items-center space-x-6">
            {[
              { href: "/", icon: <Home className="h-4 w-4" />, label: t('nav.home') },
              { href: "/browse", icon: <Search className="h-4 w-4" />, label: t('nav.browse') },
              { href: "/bookmarks", icon: <Bookmark className="h-4 w-4" />, label: t('nav.bookmarks') },
              { href: "/about", label: t('nav.about') },
              { href: "/contact", label: t('nav.contact') }
            ].map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                className="text-sm font-medium transition-colors hover:text-primary"
                asChild
              >
                <Link href={item.href}>
                  <motion.div
                    className="flex items-center gap-2"
                    variants={navItemVariants}
                    whileHover="hover"
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.icon}
                    {item.label}
                  </motion.div>
                </Link>
              </Button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
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
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage('en')}>
                  English {language === 'en' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('hi')}>
                  हिंदी {language === 'hi' && '✓'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

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
                style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
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
          </div>
        </nav>
      </div>
    </motion.header>
  );
}