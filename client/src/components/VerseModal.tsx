import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, Copy, Check, Heart } from "lucide-react";
import { useState, useCallback, memo } from "react";
import { useToast } from "@/hooks/use-toast";
import ShareDialog from "./ShareDialog";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

interface Tab {
  id: string;
  label: string;
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

  // Create available tabs
  const tabs: Tab[] = [
    { id: 'translations', label: 'Translations' },
    { id: 'original', label: 'Original Text' },
    verse.chinmay?.hc ? { id: 'commentary', label: 'Commentary' } : null
  ].filter((tab): tab is Tab => tab !== null);

  const handleCopy = useCallback(async () => {
    const textToCopy = `${verse.siva?.et || verse.purohit?.et || verse.tej.et}\n\n${verse.slok}\n\n${verse.transliteration}`;
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
  }, [verse, toast]);

  return (
    <div className="flex h-[85vh] sm:h-[80vh] flex-col">
      {/* Header */}
      <DialogHeader className="flex-none p-4 sm:p-6 pb-4 border-b relative">
        <DialogClose onClick={onClose} />
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
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
      <Tabs defaultValue="translations" className="flex-1 flex flex-col min-h-0">
        <TabsList className="flex border-b px-4 sm:px-6 overflow-x-auto">
          {tabs.map(tab => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex-1 whitespace-nowrap"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex-1 overflow-y-auto">
          {/* Translations Content */}
          <TabsContent value="translations" className="p-4 sm:p-6 space-y-6">
            {translations.map((trans, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="space-y-2"
              >
                <div className="text-sm font-medium text-muted-foreground">
                  {trans.author}'s Translation
                </div>
                <div className="text-lg leading-relaxed">
                  {trans.text}
                </div>
              </motion.div>
            ))}
          </TabsContent>

          {/* Original Text Content */}
          <TabsContent value="original" className="p-4 sm:p-6 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg border bg-muted/50"
            >
              <div className="text-sm font-medium text-muted-foreground mb-3">
                Sanskrit Text
              </div>
              <div className="text-xl leading-relaxed font-sanskrit mb-3">
                {verse.slok}
              </div>
              <div className="text-sm italic text-muted-foreground">
                {verse.transliteration}
              </div>
            </motion.div>

            {verse.tej.ht && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-4 rounded-lg border bg-muted/50"
              >
                <div className="text-sm font-medium text-muted-foreground mb-3">
                  हिंदी अनुवाद
                </div>
                <div className="text-lg leading-relaxed">
                  {verse.tej.ht}
                </div>
              </motion.div>
            )}
          </TabsContent>

          {/* Commentary Content */}
          {verse.chinmay?.hc && (
            <TabsContent value="commentary" className="p-4 sm:p-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="prose prose-invert max-w-none"
              >
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {verse.chinmay.hc}
                </div>
              </motion.div>
            </TabsContent>
          )}
        </div>
      </Tabs>

      {/* Actions */}
      <div className="flex-none p-4 sm:p-6 pt-4 border-t space-x-2">
        <Button
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={() => setShowShareDialog(true)}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share Verse
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
              Copy Text
            </>
          )}
        </Button>
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
      <DialogContent className="h-full sm:h-auto max-h-full sm:max-h-[85vh] w-full max-w-4xl p-0">
        <VerseContent verse={verse} onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}