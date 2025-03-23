import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, Copy, Check, Heart } from "lucide-react";
import { useState, useCallback, memo } from "react";
import { useToast } from "@/hooks/use-toast";
import ShareDialog from "./ShareDialog";
import { motion } from "framer-motion";

interface Translation {
  author: string;
  text: string;
}

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

const VerseContent = memo(({ verse, onClose }: { verse: NonNullable<VerseModalProps["verse"]>; onClose: () => void }) => {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Get available translations
  const translations: Translation[] = [
    verse.siva?.et ? { author: 'Siva', text: verse.siva.et } : null,
    verse.purohit?.et ? { author: 'Purohit', text: verse.purohit.et } : null,
    { author: 'Tej', text: verse.tej.et }
  ].filter((t): t is Translation => t !== null);

  const handleCopy = useCallback(async () => {
    const textToCopy = `${verse.slok}\n\n${verse.transliteration}\n\n${translations[0].text}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      toast({ 
        title: "Copied!",
        description: "Verse has been copied to clipboard",
        duration: 2000 
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({ 
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
        duration: 2000 
      });
    }
  }, [verse, translations, toast]);

  return (
    <div className="flex flex-col divide-y divide-border">
      {/* Header */}
      <DialogHeader className="flex-none relative">
        <DialogClose onClick={onClose} />
        <div className="flex items-center gap-3 pr-8">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Heart className="h-5 w-5 text-primary" />
          </div>
          <div>
            <DialogTitle>
              Chapter {verse.chapter}, Verse {verse.verse}
            </DialogTitle>
            <div className="text-sm text-muted-foreground">Bhagavad Gita</div>
          </div>
        </div>
      </DialogHeader>

      {/* Content */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className="p-4 sm:p-6 space-y-6">
          {/* Sanskrit Text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border bg-muted/30 p-4 space-y-3"
          >
            <div className="text-sm font-medium text-muted-foreground">
              Sanskrit
            </div>
            <div className="text-lg sm:text-xl font-sanskrit leading-relaxed">
              {verse.slok}
            </div>
            <div className="text-sm italic text-muted-foreground">
              {verse.transliteration}
            </div>
          </motion.div>

          {/* Translations */}
          <div className="space-y-6">
            {translations.map((trans, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="space-y-2"
              >
                <div className="text-sm font-medium text-muted-foreground">
                  {trans.author}'s Translation
                </div>
                <div className="text-base sm:text-lg leading-relaxed">
                  {trans.text}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Hindi Translation if available */}
          {verse.tej.ht && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-lg border bg-muted/30 p-4 space-y-3"
            >
              <div className="text-sm font-medium text-muted-foreground">
                हिंदी अनुवाद
              </div>
              <div className="text-base sm:text-lg leading-relaxed">
                {verse.tej.ht}
              </div>
            </motion.div>
          )}

          {/* Commentary if available */}
          {verse.chinmay?.hc && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-3"
            >
              <div className="text-sm font-medium text-muted-foreground">
                Commentary
              </div>
              <div className="prose prose-sm prose-invert max-w-none">
                <div className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                  {verse.chinmay.hc}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex-none p-4 sm:p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex gap-3">
          <Button
            className="flex-1 bg-primary hover:bg-primary/90"
            onClick={() => setShowShareDialog(true)}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </>
            )}
          </Button>
        </div>
      </div>

      <ShareDialog
        verse={verse}
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
      />
    </div>
  );
});

VerseContent.displayName = 'VerseContent';

export default function VerseModal({ verse, open, onOpenChange }: VerseModalProps) {
  if (!verse) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-4rem)]">
        <VerseContent verse={verse} onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}