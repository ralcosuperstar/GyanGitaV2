import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, Copy, Check, Heart } from "lucide-react";
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import ShareDialog from "./ShareDialog";

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

function VerseContent({ verse, onClose }: { 
  verse: NonNullable<VerseModalProps["verse"]>; 
  onClose: () => void;
}) {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Only use Siva's and Purohit's translations
  const translations = [
    verse.siva?.et ? { author: 'Siva', text: verse.siva.et } : null,
    verse.purohit?.et ? { author: 'Purohit', text: verse.purohit.et } : null,
  ].filter((t): t is Translation => t !== null);

  const handleCopy = useCallback(async () => {
    const textToCopy = `${verse.slok}\n\n${verse.transliteration}\n\n${translations[0]?.text || ''}`;

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
  }, [verse, translations, toast]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <DialogHeader className="relative border-b">
        <DialogClose onClick={onClose} />
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Heart className="h-6 w-6 text-primary" />
          </div>
          <div>
            <DialogTitle className="text-xl font-medium">
              Chapter {verse.chapter}, Verse {verse.verse}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">Bhagavad Gita</p>
          </div>
        </div>
      </DialogHeader>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-8">
          {/* Sanskrit */}
          <div className="rounded-lg border bg-muted/50 p-6 space-y-3">
            <h3 className="text-lg font-medium text-primary">Sanskrit</h3>
            <p className="text-xl font-sanskrit leading-relaxed">{verse.slok}</p>
            <p className="text-sm italic text-muted-foreground">{verse.transliteration}</p>
          </div>

          {/* Translations */}
          {translations.map((trans, idx) => (
            <div key={idx} className="space-y-3">
              <h3 className="text-lg font-medium text-primary">
                {trans.author}'s Translation
              </h3>
              <p className="text-lg leading-relaxed">{trans.text}</p>
            </div>
          ))}

          {/* Commentary */}
          {verse.chinmay?.hc && (
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-primary">Commentary</h3>
              <div className="prose prose-lg max-w-none">
                <p className="whitespace-pre-wrap">{verse.chinmay.hc}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="border-t p-6">
        <div className="flex gap-4">
          <Button
            className="flex-1"
            onClick={() => setShowShareDialog(true)}
          >
            <Share2 className="h-5 w-5 mr-2" />
            Share
          </Button>
          <Button
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
}

export default function VerseModal({ verse, open, onOpenChange }: VerseModalProps) {
  if (!verse) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[90vh] w-[90vw] max-w-4xl p-0">
        <VerseContent verse={verse} onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}