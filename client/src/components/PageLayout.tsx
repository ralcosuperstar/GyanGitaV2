import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  title: string;
  subtitle?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

export default function PageLayout({ children, className, title, subtitle }: PageLayoutProps) {
  return (
    <motion.div
      className={cn(
        "min-h-screen bg-gradient-to-b from-primary/5 via-background to-background",
        className
      )}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-8">
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <h1 className="font-playfair text-4xl font-bold md:text-5xl mb-4">
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              {title}
            </span>
          </h1>
          {subtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>
        
        <motion.div variants={itemVariants}>
          {children}
        </motion.div>
      </div>
    </motion.div>
  );
}
