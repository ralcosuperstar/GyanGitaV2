import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, Home, Book, Info, Mail } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OmLogo } from "./icons/OmLogo";

const NAV_ITEMS = [
  { href: "/", icon: <Home className="h-4 w-4" />, text: 'Home' },
  { href: "/browse", icon: <Book className="h-4 w-4" />, text: 'Browse' },
  { href: "/about", icon: <Info className="h-4 w-4" />, text: 'About' },
  { href: "/contact", icon: <Mail className="h-4 w-4" />, text: 'Contact' }
];

function MobileMenu() {
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
                <Link href={item.href}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start mb-2 gap-3 p-6"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="flex items-center gap-3">
                      {item.icon}
                      <span className="font-medium">{item.text}</span>
                    </span>
                  </Button>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export default function Header() {
  const brandTitle = 'GyanGita';

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
                  className="font-playfair text-xl font-bold leading-none text-foreground"
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
                  className="relative group px-6"
                >
                  <span className="flex items-center gap-2">
                    {item.icon}
                    <span className="font-medium">{item.text}</span>
                  </span>
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                </Button>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </motion.header>
  );
}