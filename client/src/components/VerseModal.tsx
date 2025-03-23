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

type TabId = 'authors' | 'original' | 'commentary';

const VerseContent = memo(({ verse, onClose }: { verse: NonNullable<VerseModalProps["verse"]>; onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState<TabId>('authors');
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

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
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <DialogHeader className="relative px-6 pt-6 pb-4">
        <DialogClose onClick={onClose} />
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Heart className="h-6 w-6 text-primary" />
          </div>
          <div>
            <DialogTitle className="text-xl sm:text-2xl font-semibold">
              Chapter {verse.chapter}, Verse {verse.verse}
            </DialogTitle>
            <div className="text-sm text-muted-foreground mt-1">Bhagavad Gita</div>
          </div>
        </div>
      </DialogHeader>

      {/* Tabs */}
      <div className="flex px-6 gap-2 border-b">
        {[
          { id: 'authors', label: 'Authors' },
          { id: 'original', label: 'Original Text' },
          verse.chinmay?.hc ? { id: 'commentary', label: 'Commentary' } : null
        ].filter(Boolean).map((tab) => (
          <button
            key={tab!.id}
            onClick={() => setActiveTab(tab!.id as TabId)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors relative ${
              activeTab === tab!.id 
                ? 'text-primary bg-primary/10'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            {tab!.label}
            {activeTab === tab!.id && (
              <motion.div 
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto min-h-0 p-6">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'authors' && (
            <div className="space-y-8">
              {translations.map((trans, idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="text-lg font-medium text-primary">
                    {trans.author}'s Translation
                  </h3>
                  <p className="text-lg sm:text-xl leading-relaxed">
                    {trans.text}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'original' && (
            <div className="space-y-8">
              <div className="rounded-xl border bg-muted/30 p-6 space-y-4">
                <h3 className="text-lg font-medium text-primary">Sanskrit</h3>
                <div className="text-xl sm:text-2xl font-sanskrit leading-relaxed">
                  {verse.slok}
                </div>
                <div className="text-sm italic text-muted-foreground">
                  {verse.transliteration}
                </div>
              </div>

              {verse.tej.ht && (
                <div className="rounded-xl border bg-muted/30 p-6 space-y-4">
                  <h3 className="text-lg font-medium text-primary">हिंदी अनुवाद</h3>
                  <div className="text-lg sm:text-xl leading-relaxed">
                    {verse.tej.ht}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'commentary' && verse.chinmay?.hc && (
            <div className="prose prose-lg prose-invert max-w-none">
              <div className="text-lg leading-relaxed whitespace-pre-wrap">
                {verse.chinmay.hc}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Actions */}
      <div className="flex-none p-6 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex gap-4">
          <Button
            size="lg"
            className="flex-1 bg-primary hover:bg-primary/90"
            onClick={() => setShowShareDialog(true)}
          >
            <Share2 className="h-5 w-5 mr-2" />
            Share
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="flex-1"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="h-5 w-5 mr-2" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-5 w-5 mr-2" />
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
      <DialogContent className="h-[95vh] w-[95vw] max-w-5xl p-4"> {/* Modified for fullscreen and padding */}
        <VerseContent verse={verse} onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}