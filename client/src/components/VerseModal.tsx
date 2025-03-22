import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, Copy, Check, ArrowRight, Heart } from "lucide-react";
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

const VerseContent = memo(({ verse }: { verse: NonNullable<VerseModalProps["verse"]>; }) => {
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
    <div className="flex flex-col h-full">
      {/* Header */}
      <DialogHeader className="flex-none pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Heart className="h-5 w-5 text-primary" />
          </div>
          <div>
            <DialogTitle className="text-lg font-medium">
              Chapter {verse.chapter}, Verse {verse.verse}
            </DialogTitle>
            <div className="text-sm text-muted-foreground">Bhagavad Gita</div>
          </div>
        </div>
      </DialogHeader>

      {/* Content */}
      <Tabs defaultValue="translations" className="flex-1 flex flex-col min-h-0">
        <TabsList className="flex border-b border-border">
          {tabs.map(tab => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex-1 px-4 py-2 text-sm font-medium text-muted-foreground
                        data-[state=active]:border-b-2 data-[state=active]:border-primary 
                        data-[state=active]:text-foreground"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex-1 overflow-y-auto min-h-0">
          {/* Translations Content */}
          <TabsContent value="translations" className="p-4 space-y-6">
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
          <TabsContent value="original" className="p-4 space-y-4">
            {/* Sanskrit Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg border border-border bg-muted/50"
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

            {/* Hindi Section */}
            {verse.tej.ht && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-4 rounded-lg border border-border bg-muted/50"
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
            <TabsContent value="commentary" className="p-4">
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
      <div className="flex-none border-t border-border pt-4 mt-4 space-x-2">
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
      <DialogContent className="h-[80vh] max-h-[800px] w-[90vw] max-w-3xl mx-auto p-6">
        <VerseContent verse={verse} />
      </DialogContent>
    </Dialog>
  );
}