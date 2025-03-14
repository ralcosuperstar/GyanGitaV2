import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, Copy, Check, Book } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Verse } from "@/lib/data";
import ShareDialog from "./ShareDialog";

interface VerseModalProps {
  verse: Verse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function VerseModal({ verse, open, onOpenChange }: VerseModalProps) {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  if (!verse) return null;

  const handleCopy = async () => {
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
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="px-6 py-8 space-y-8">
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-2xl font-playfair text-foreground">
                Chapter {verse.chapter}, Verse {verse.verse}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-8">
              {/* English Translation Section */}
              <div className="bg-card rounded-lg p-8 space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2 text-foreground">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  English Translation
                </h3>
                <p className="text-xl leading-relaxed text-foreground">
                  {verse.purohit?.et || verse.tej.et || verse.siva?.et || verse.tej.ht}
                </p>
              </div>

              {/* Sanskrit Text */}
              <div className="bg-card rounded-lg p-8 space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2 text-foreground">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  Sanskrit Text
                </h3>
                <p className="text-2xl font-sanskrit leading-relaxed text-foreground">
                  {verse.slok}
                </p>
                <p className="text-lg italic text-foreground opacity-90">
                  {verse.transliteration}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <Button
                  className="flex-1 bg-primary/10 hover:bg-primary/20"
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
          </div>
        </DialogContent>
      </Dialog>

      <ShareDialog
        verse={verse}
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
      />
    </>
  );
}