import { Link } from "wouter";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

// Animation variants for footer elements
const footerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const linkVariants = {
  hover: { 
    scale: 1.05,
    color: "var(--primary)",
    transition: { type: "spring", stiffness: 400, damping: 25 }
  },
  tap: { scale: 0.95 }
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer 
      className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={footerVariants}
    >
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-3">
            <h3 className="font-playfair text-lg font-semibold gradient-heading">Contact</h3>
            <ul className="space-y-2">
              <li>
                <motion.div 
                  variants={linkVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <a 
                    href="mailto:support@gyangita.com" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group w-fit"
                  >
                    support@gyangita.com
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </motion.div>
              </li>
              <li>
                <motion.div
                  variants={linkVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <a 
                    href="tel:+919370922063" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group w-fit"
                  >
                    +91 9370922063
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </motion.div>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-playfair text-lg font-semibold gradient-heading">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/browse">
                  <motion.div 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    variants={linkVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    Browse Verses
                  </motion.div>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <motion.div 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    variants={linkVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    About Us
                  </motion.div>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <motion.div 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    variants={linkVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    Contact Us
                  </motion.div>
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-playfair text-lg font-semibold gradient-heading">Credits</h3>
            <motion.p 
              className="text-sm text-muted-foreground"
              variants={footerVariants}
            >
              API provided by{" "}
              <motion.span
                className="inline-block"
                variants={linkVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <a
                  href="https://github.com/vedicscriptures"
                  className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1 group w-fit"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Pt. Prashant Tripathi & Team
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </motion.span>
            </motion.p>
          </div>
        </div>

        <motion.div 
          className="mt-12 pt-8 border-t text-center"
          variants={footerVariants}
        >
          <p className="text-sm text-muted-foreground">
            © {currentYear} GyanGita. All rights reserved.
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
}