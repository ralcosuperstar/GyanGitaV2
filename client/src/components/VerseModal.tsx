import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, Copy, Check, ArrowRight, Heart } from "lucide-react";
import { useState, useCallback, memo } from "react";
import { useToast } from "@/hooks/use-toast";
import ShareDialog from "./ShareDialog";
import { motion, AnimatePresence } from "framer-motion";

interface VerseModalProps {
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
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VerseContent = memo(({ 
  verse
}: { 
  verse: NonNullable<VerseModalProps["verse"]>;
}) => {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = useCallback(async () => {
    const textToCopy = `${verse.purohit?.et || verse.tej.et || verse.siva?.et}\n\n${verse.slok}\n\n${verse.transliteration}`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Verse has been copied to clipboard",
        duration: 2000,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
        duration: 2000,
      });
    }
  }, [verse, toast]);

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-30" />

        <div className="relative p-4 sm:p-6 md:p-8">
          <div className="flex items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <span className="text-sm font-medium text-white/60 uppercase tracking-wider block">Bhagavad Gita</span>
                <span className="text-sm text-white/40">Chapter {verse.chapter}, Verse {verse.verse}</span>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="backdrop-blur-lg bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl p-6 border border-white/10 shadow-lg group hover:bg-white/[0.07] transition-all duration-300"
              >
                <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-6">
                  Sanskrit Text
                </h3>
                <div className="space-y-6">
                  <p className="text-2xl leading-relaxed text-white/90 font-light break-words">
                    {verse.slok}
                  </p>
                  <div className="pt-6 border-t border-white/10">
                    <p className="text-base text-gray-400 break-words">
                      {verse.transliteration}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="backdrop-blur-lg bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl p-6 border border-white/10 shadow-lg group hover:bg-white/[0.07] transition-all duration-300"
              >
                <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-6">
                  Translation
                </h3>
                <div className="prose prose-invert max-w-none">
                  <p className="text-2xl leading-relaxed text-white/90 font-light break-words">
                    {verse.purohit?.et || verse.tej.et || verse.siva?.et}
                  </p>
                </div>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/10"
            >
              <Button
                className="flex-1 bg-gradient-to-r from-primary/90 to-primary/80 hover:from-primary/80 hover:to-primary/70 
                       border border-primary/30 shadow-lg hover:shadow-xl backdrop-blur-sm 
                       transition-all duration-300 text-white py-6 group"
                onClick={() => setShowShareDialog(true)}
              >
                <span className="flex items-center justify-center">
                  <Share2 className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
                  Share Verse
                  <ArrowRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </span>
              </Button>
              <Button
                variant="outline"
                className="flex-1 backdrop-blur-md bg-gradient-to-r from-white/10 to-white/5 
                       border border-white/20 hover:bg-white/10 hover:border-white/30 
                       shadow-lg hover:shadow-xl transition-all duration-300 py-6 group"
                onClick={handleCopy}
              >
                {copied ? (
                  <span className="flex items-center justify-center">
                    <Check className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                    Copied
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <Copy className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                    Copy Text
                  </span>
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <ShareDialog
        verse={verse}
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
      />
    </>
  );
});

VerseContent.displayName = 'VerseContent';

export default function VerseModal({ 
  verse, 
  open, 
  onOpenChange
}: VerseModalProps) {
  if (!verse) return null;

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="w-[calc(100%-2rem)] sm:w-[calc(100%-4rem)] max-w-5xl mx-auto my-4 max-h-[calc(100vh-2rem)] overflow-y-auto 
                                backdrop-blur-xl bg-gradient-to-br from-black/50 to-black/30 
                                border border-white/10 rounded-xl shadow-2xl"
          >
            <VerseContent verse={verse} />
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}