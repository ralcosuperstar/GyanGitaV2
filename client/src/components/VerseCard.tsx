import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Book, ArrowRight } from "lucide-react";
import ShareDialog from "./ShareDialog";
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
  variant?: 'compact' | 'detailed';
}

export default function VerseCard({
  verse,
  showActions = true,
  variant = 'compact'
}: VerseCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  // Get the primary translation, prioritizing Purohit's translation
  const primaryTranslation = verse.purohit?.et || verse.tej.et || verse.siva?.et;

  // Check if we have any Sanskrit content
  const hasSanskrit = verse.slok && verse.transliteration;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="h-full"
    >
      <Card className="h-full backdrop-blur-lg bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="flex flex-col h-full p-6 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-30" />

          <div className="relative z-10 flex flex-col h-full">
            {/* Header with Chapter/Verse Numbers */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-lg backdrop-blur-md bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/20">
                  <span className="text-sm text-white/60">Ch.{verse.chapter}</span>
                </div>
                <div className="px-3 py-1.5 rounded-lg backdrop-blur-md bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/20">
                  <span className="text-sm text-white/60">V.{verse.verse}</span>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow space-y-6">
              {/* English Translation */}
              {primaryTranslation && (
                <div className="backdrop-blur-sm bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-lg text-white/90 leading-relaxed font-light">
                    {primaryTranslation}
                  </p>
                </div>
              )}

              {/* Sanskrit Preview - Only show if we have both slok and transliteration */}
              {hasSanskrit && (
                <div className="backdrop-blur-sm bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="font-sanskrit text-base leading-relaxed line-clamp-2 mb-2 text-white/70">
                    {verse.slok}
                  </p>
                  <p className="text-sm italic text-white/50 line-clamp-1">
                    {verse.transliteration}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 mt-4 border-t border-white/10">
              <Button
                onClick={() => setShowModal(true)}
                className="flex-1 bg-gradient-to-r from-primary/90 to-primary/80 hover:from-primary/80 hover:to-primary/70 
                          border border-primary/30 shadow-lg hover:shadow-xl backdrop-blur-sm 
                          transition-all duration-300 text-white py-5 group"
              >
                <span className="flex items-center justify-center">
                  <Book className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
                  Read Full Verse
                  <ArrowRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </span>
              </Button>

              {showActions && (
                <Button
                  variant="outline"
                  onClick={() => setShowShareDialog(true)}
                  className="px-5 backdrop-blur-md bg-gradient-to-r from-white/10 to-white/5 
                            border border-white/20 hover:bg-white/10 hover:border-white/30 
                            shadow-lg hover:shadow-xl transition-all duration-300 py-5 group"
                >
                  <Share2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <VerseModal
        verse={verse}
        open={showModal}
        onOpenChange={setShowModal}
      />

      <ShareDialog
        verse={verse}
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
      />
    </motion.div>
  );
}