import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book, ArrowRight } from "lucide-react";
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

export default function VerseCard({
  verse,
  showActions = true,
}: VerseCardProps) {
  const [showModal, setShowModal] = useState(false);

  // Get Siva's translation first, fallback to other translations if not available
  const translation = verse.siva?.et || verse.purohit?.et || verse.tej.et;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="h-full"
    >
      <Card className="h-full backdrop-blur-lg bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="flex flex-col h-full p-4 sm:p-6 relative">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-30" />

          <div className="relative z-10 flex flex-col h-full">
            {/* Header with Chapter/Verse Numbers */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="px-2 py-1 rounded-lg backdrop-blur-md bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/20">
                  <span className="text-xs text-white/60">Ch.{verse.chapter}</span>
                </div>
                <div className="px-2 py-1 rounded-lg backdrop-blur-md bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/20">
                  <span className="text-xs text-white/60">V.{verse.verse}</span>
                </div>
              </div>
            </div>

            {/* Translation Preview */}
            <div className="flex-grow">
              <div className="backdrop-blur-sm bg-white/5 rounded-lg p-3 border border-white/10">
                <p className="text-base text-white/90 leading-relaxed">
                  {translation}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-4 mt-4 border-t border-white/10">
              <Button
                onClick={() => setShowModal(true)}
                className="flex-1 bg-gradient-to-r from-primary/90 to-primary/80 hover:from-primary/80 hover:to-primary/70 
                          border border-primary/30 shadow-lg hover:shadow-xl backdrop-blur-sm 
                          transition-all duration-300 py-4 group"
              >
                <span className="flex items-center justify-center text-sm">
                  <Book className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
                  Read More
                  <ArrowRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <VerseModal
        verse={verse}
        open={showModal}
        onOpenChange={setShowModal}
      />
    </motion.div>
  );
}