import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, ChevronDown, ChevronUp } from "lucide-react";
import ShareDialog from "./ShareDialog";
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";

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
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Get all available translations
  const translations = [
    verse.purohit?.et && { author: 'Purohit', text: verse.purohit.et },
    { author: 'Tej', text: verse.tej.et },
    verse.siva?.et && { author: 'Siva', text: verse.siva.et }
  ].filter(Boolean);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="h-full"
    >
      <Card className="h-full backdrop-blur-lg bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="flex flex-col h-full p-4 sm:p-6 relative">
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

            {/* Main Content */}
            <div className="flex-grow space-y-4">
              {/* Sanskrit Text */}
              <div className="backdrop-blur-sm bg-white/5 rounded-lg p-3 border border-white/10">
                <p className="font-sanskrit text-lg leading-relaxed text-white/90 mb-2">
                  {verse.slok}
                </p>
                <p className="text-sm italic text-white/60">
                  {verse.transliteration}
                </p>
              </div>

              {/* Main Translation */}
              <div className="backdrop-blur-sm bg-white/5 rounded-lg p-3 border border-white/10">
                <h4 className="text-xs font-medium text-primary/80 uppercase tracking-wider mb-2">
                  Translation
                </h4>
                <p className="text-base text-white/90 leading-relaxed">
                  {verse.purohit?.et || verse.tej.et || verse.siva?.et}
                </p>
              </div>

              {/* Expandable Content */}
              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 overflow-hidden"
                  >
                    {/* Additional Translations */}
                    {translations.length > 1 && (
                      <div className="space-y-4">
                        {translations.map((trans, idx) => (
                          trans && idx > 0 && (
                            <div key={idx} className="backdrop-blur-sm bg-white/5 rounded-lg p-3 border border-white/10">
                              <h4 className="text-xs font-medium text-primary/80 uppercase tracking-wider mb-2">
                                {trans.author}'s Translation
                              </h4>
                              <p className="text-base text-white/90 leading-relaxed">
                                {trans.text}
                              </p>
                            </div>
                          )
                        ))}
                      </div>
                    )}

                    {/* Hindi Translation */}
                    {verse.tej.ht && (
                      <div className="backdrop-blur-sm bg-white/5 rounded-lg p-3 border border-white/10">
                        <h4 className="text-xs font-medium text-primary/80 uppercase tracking-wider mb-2">
                          हिंदी अनुवाद
                        </h4>
                        <p className="text-base text-white/90 leading-relaxed">
                          {verse.tej.ht}
                        </p>
                      </div>
                    )}

                    {/* Commentary */}
                    {verse.chinmay?.hc && (
                      <div className="backdrop-blur-sm bg-white/5 rounded-lg p-3 border border-white/10">
                        <h4 className="text-xs font-medium text-primary/80 uppercase tracking-wider mb-2">
                          Commentary
                        </h4>
                        <p className="text-sm text-white/90 leading-relaxed whitespace-pre-wrap">
                          {verse.chinmay.hc}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-4 mt-4 border-t border-white/10">
              <Button
                onClick={() => setExpanded(!expanded)}
                variant="outline"
                className="flex-1 backdrop-blur-md bg-gradient-to-r from-white/10 to-white/5 
                          border border-white/20 hover:bg-white/10 hover:border-white/30 
                          shadow-lg hover:shadow-xl transition-all duration-300 py-4 group"
              >
                <span className="flex items-center justify-center text-sm">
                  {expanded ? (
                    <>Show Less <ChevronUp className="h-4 w-4 ml-2" /></>
                  ) : (
                    <>Show More <ChevronDown className="h-4 w-4 ml-2" /></>
                  )}
                </span>
              </Button>

              {showActions && (
                <Button
                  variant="outline"
                  onClick={() => setShowShareDialog(true)}
                  className="px-4 backdrop-blur-md bg-gradient-to-r from-white/10 to-white/5 
                            border border-white/20 hover:bg-white/10 hover:border-white/30 
                            shadow-lg hover:shadow-xl transition-all duration-300 py-4 group"
                >
                  <Share2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <ShareDialog
        verse={verse}
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
      />
    </motion.div>
  );
}