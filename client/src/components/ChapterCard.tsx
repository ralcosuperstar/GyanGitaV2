import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Grid, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";
import type { Chapter } from "@/lib/data";

interface ChapterCardProps {
  chapter: Chapter;
  onViewVerses: (chapterNumber: number) => void;
}

export default function ChapterCard({ chapter, onViewVerses }: ChapterCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleViewVerses = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewVerses(chapter.chapter_number);
  };

  const handleShowMore = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg",
      isExpanded && "border-primary"
    )}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="font-playfair">Chapter {chapter.chapter_number}</CardTitle>
          <span className="text-sm text-primary/70">{chapter.verses_count} verses</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium text-lg mb-1 group-hover:text-primary transition-colors">
            {chapter.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {chapter.translation}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-primary/10 hover:text-primary justify-start"
            onClick={handleShowMore}
          >
            {isExpanded ? (
              <>Show Less <ChevronUp className="ml-2 h-4 w-4" /></>
            ) : (
              <>Show More <ChevronDown className="ml-2 h-4 w-4" /></>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-primary/10 hover:text-primary"
            onClick={handleViewVerses}
          >
            <Grid className="h-4 w-4 mr-2" />
            View Verses
          </Button>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 overflow-hidden"
            >
              {/* Chapter Meaning */}
              {chapter.meaning?.en && (
                <div className="pt-4 border-t border-border/50">
                  <h4 className="text-sm font-medium text-primary/80 uppercase tracking-wider mb-2">
                    Meaning
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {chapter.meaning.en}
                  </p>
                </div>
              )}

              {/* Chapter Summary */}
              {chapter.summary?.en && (
                <div className="pt-4 border-t border-border/50">
                  <h4 className="text-sm font-medium text-primary/80 uppercase tracking-wider mb-2">
                    Summary
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {chapter.summary.en}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}