import { useState, memo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book } from "lucide-react";
import VerseModal from "./VerseModal";
import { motion } from 'framer-motion';

interface VerseCardProps {
  verse: {
    chapter: number;
    verse: number;
    slok: string;
    transliteration: string;
    tej: {
      ht: string;
      et: string;
    };
    siva?: {
      et: string;
    };
    purohit?: {
      et: string;
    };
    chinmay?: {
      hc: string;
    };
  };
  showActions?: boolean;
}

const VerseCard = memo(({
  verse,
  showActions = true,
}: VerseCardProps) => {
  const [showModal, setShowModal] = useState(false);

  // Get Siva's translation first, fallback to other translations if not available
  const translation = verse.siva?.et || verse.purohit?.et || verse.tej.et;

  return (
    <motion.div
      initial={false}
      className="h-full"
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
    >
      <Card className="h-full bg-card border-border overflow-hidden">
        <div className="flex flex-col h-full p-4 sm:p-6">
          {/* Header with Chapter/Verse Numbers */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 rounded-lg bg-primary/10">
                <span className="text-xs">Ch.{verse.chapter}</span>
              </div>
              <div className="px-2 py-1 rounded-lg bg-primary/10">
                <span className="text-xs">V.{verse.verse}</span>
              </div>
            </div>
          </div>

          {/* Translation Preview */}
          <div className="flex-grow">
            <div className="rounded-lg p-3 bg-muted/30">
              <p className="text-base leading-relaxed">
                {translation}
              </p>
            </div>
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex items-center gap-2 pt-4 mt-4 border-t border-border">
              <Button
                onClick={() => setShowModal(true)}
                className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary"
              >
                <Book className="h-4 w-4 mr-2" />
                Read More
              </Button>
            </div>
          )}
        </div>
      </Card>

      <VerseModal
        verse={verse}
        open={showModal}
        onOpenChange={setShowModal}
      />
    </motion.div>
  );
});

VerseCard.displayName = 'VerseCard';

export default VerseCard;