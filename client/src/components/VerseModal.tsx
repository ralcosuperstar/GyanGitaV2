import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, Copy, Check } from "lucide-react";
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import ShareDialog from "./ShareDialog";

interface VerseModalProps {
  verse: {
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
    chapter: number;
    verse: number;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function VerseModal({ verse, open, onOpenChange }: VerseModalProps) {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  if (!verse) return null;

  // Only use Siva's or Purohit's translation
  const translation = verse.siva?.et || verse.purohit?.et;
  if (!translation) return null;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(
        `${verse.slok}\n\n${verse.transliteration}\n\n${translation}`
      );
      setCopied(true);
      toast({
        title: "Copied to clipboard",
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
  }, [verse, translation, toast]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-3xl">
        <DialogHeader className="border-b">
          <DialogClose onClick={() => onOpenChange(false)} />
          <div className="flex items-center gap-4 pr-10">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xl font-medium text-primary">{verse.verse}</span>
            </div>
            <div>
              <DialogTitle className="text-xl font-medium mb-1">
                Chapter {verse.chapter}, Verse {verse.verse}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">Bhagavad Gita</p>
            </div>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(85vh-14rem)]">
          <div className="p-6 space-y-8">
            {/* Sanskrit */}
            <div className="rounded-lg border bg-muted/30 p-6 space-y-3">
              <h3 className="text-lg font-medium text-primary">Sanskrit</h3>
              <p className="text-xl font-sanskrit leading-relaxed">{verse.slok}</p>
              <p className="text-sm italic text-muted-foreground">{verse.transliteration}</p>
            </div>

            {/* Translation */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-primary">
                {verse.siva?.et ? "Siva's" : "Purohit's"} Translation
              </h3>
              <p className="text-lg leading-relaxed">{translation}</p>
            </div>

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
      </DialogContent>
    </Dialog>
  );
}