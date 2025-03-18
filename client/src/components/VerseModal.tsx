import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, Copy, Check, ArrowRight } from "lucide-react";
import { useState, useCallback, memo } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Verse } from "@/lib/data";
import ShareDialog from "./ShareDialog";
import { motion, AnimatePresence } from "framer-motion";

interface VerseModalProps {
  verse: Verse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Memoize modal content to prevent unnecessary re-renders
const VerseContent = memo(({ verse }: { verse: Verse }) => {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = useCallback(async () => {
    const englishTranslation = verse.purohit?.et || verse.tej.et || verse.siva?.et || verse.tej.ht;
    const textToCopy = `${englishTranslation}\n\n${verse.slok}\n\n${verse.transliteration}`;

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
      });
    }
  }, [verse, toast]);

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="px-4 sm:px-8 py-8 space-y-8"
      >
        <DialogHeader>
          <div className="flex items-center gap-4 mb-2">
            <div className="px-3 py-1.5 rounded-full backdrop-blur-md bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/20">
              <span className="text-sm font-medium text-white/90">Chapter {verse.chapter}</span>
            </div>
            <div className="px-3 py-1.5 rounded-full backdrop-blur-md bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/20">
              <span className="text-sm font-medium text-white/90">Verse {verse.verse}</span>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-8">
          {/* English Translation Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="backdrop-blur-lg bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl p-6 sm:p-8 border border-white/10 shadow-lg"
          >
            <h3 className="text-base font-medium flex items-center gap-2 text-white/60 mb-4 uppercase tracking-wider">
              English Translation
            </h3>
            <p className="text-2xl leading-relaxed text-white/90 font-light">
              {verse.purohit?.et || verse.tej.et || verse.siva?.et || verse.tej.ht}
            </p>
          </motion.div>

          {/* Sanskrit Text */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="backdrop-blur-lg bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl p-6 sm:p-8 border border-white/10 shadow-lg"
          >
            <h3 className="text-base font-medium flex items-center gap-2 text-white/60 mb-4 uppercase tracking-wider">
              Sanskrit Text
            </h3>
            <p className="text-2xl leading-relaxed text-white/90 font-light">
              {verse.slok}
            </p>
            <p className="mt-4 text-base text-gray-400">
              {verse.transliteration}
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-4 pt-4"
          >
            <Button
              className="flex-1 bg-gradient-to-r from-primary/90 to-primary/80 hover:from-primary/80 hover:to-primary/70 
                       border border-primary/30 shadow-lg hover:shadow-xl backdrop-blur-sm 
                       transition-all duration-300 text-white py-6 group"
              onClick={() => setShowShareDialog(true)}
            >
              <span className="flex items-center">
                Share Verse
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
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
                <>
                  <Check className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  <span>Copy Text</span>
                </>
              )}
            </Button>
          </motion.div>
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

export default function VerseModal({ verse, open, onOpenChange }: VerseModalProps) {
  if (!verse) return null;

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-3xl mx-auto max-h-[90vh] overflow-y-auto 
                                  backdrop-blur-xl bg-gradient-to-br from-black/50 to-black/30 
                                  border border-white/10 rounded-xl">
            <VerseContent verse={verse} />
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}