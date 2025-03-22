import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, Copy, Check, ArrowRight, Heart } from "lucide-react";
import { useState, useCallback, memo } from "react";
import { useToast } from "@/hooks/use-toast";
import ShareDialog from "./ShareDialog";
import { motion, AnimatePresence } from "framer-motion";
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
    verse.purohit?.et ? { author: 'Purohit', text: verse.purohit.et } : null,
    { author: 'Tej', text: verse.tej.et },
    verse.siva?.et ? { author: 'Siva', text: verse.siva.et } : null
  ].filter((t): t is Translation => t !== null);

  // Check what content is available
  const hasTranslations = translations.length > 0;
  const hasSanskrit = Boolean(verse.slok && verse.transliteration);
  const hasCommentary = Boolean(verse.chinmay?.hc);

  // Create available tabs
  const tabs: Tab[] = [
    hasTranslations ? { id: 'translation', label: 'Translation' } : null,
    hasSanskrit ? { id: 'sanskrit', label: 'Sanskrit' } : null,
    hasCommentary ? { id: 'commentary', label: 'Commentary' } : null
  ].filter((tab): tab is Tab => tab !== null);

  const handleCopy = useCallback(async () => {
    const textToCopy = `${verse.purohit?.et || verse.tej.et || verse.siva?.et}\n\n${verse.slok}\n\n${verse.transliteration}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      toast({ title: "Copied!", description: "Verse has been copied to clipboard", duration: 2000 });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({ title: "Failed to copy", description: "Please try again", variant: "destructive", duration: 2000 });
    }
  }, [verse, toast]);

  if (tabs.length === 0) return null;

  return (
    <>
      <div className="relative">
        {/* Verse Info Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Heart className="h-5 w-5 text-primary" />
          </div>
          <div>
            <span className="text-sm font-medium text-white/60 uppercase tracking-wider block">
              Bhagavad Gita
            </span>
            <span className="text-sm text-white/40">
              Chapter {verse.chapter}, Verse {verse.verse}
            </span>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue={tabs[0]?.id} className="space-y-6">
          <TabsList className="w-full flex space-x-2 h-12 p-1 bg-transparent border-b border-white/10">
            {tabs.map(tab => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex-1 text-sm font-medium data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Translation Tab */}
          {hasTranslations && (
            <TabsContent value="translation" className="space-y-6 mt-6">
              {translations.map((trans, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="space-y-2"
                >
                  <h3 className="text-sm font-medium text-white/60">
                    {trans.author}'s Translation
                  </h3>
                  <p className="text-xl leading-relaxed text-white/90">
                    {trans.text}
                  </p>
                </motion.div>
              ))}
            </TabsContent>
          )}

          {/* Sanskrit Tab */}
          {hasSanskrit && (
            <TabsContent value="sanskrit" className="space-y-6 mt-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-white/60">
                    Sanskrit Verse
                  </h3>
                  <p className="text-2xl leading-relaxed font-sanskrit text-white/90">
                    {verse.slok}
                  </p>
                </div>

                <div className="space-y-2 pt-6 border-t border-white/10">
                  <h3 className="text-sm font-medium text-white/60">
                    Transliteration
                  </h3>
                  <p className="text-lg italic text-white/80">
                    {verse.transliteration}
                  </p>
                </div>
              </motion.div>
            </TabsContent>
          )}

          {/* Commentary Tab */}
          {hasCommentary && verse.chinmay?.hc && (
            <TabsContent value="commentary" className="space-y-6 mt-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <h3 className="text-sm font-medium text-white/60">
                  Commentary
                </h3>
                <div className="prose prose-invert max-w-none">
                  <p className="text-lg leading-relaxed text-white/90 whitespace-pre-wrap">
                    {verse.chinmay.hc}
                  </p>
                </div>
              </motion.div>
            </TabsContent>
          )}
        </Tabs>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 pt-6 mt-8 border-t border-white/10"
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
          <DialogContent className="w-[calc(100%-2rem)] sm:w-[calc(100%-4rem)] max-w-5xl mx-auto my-4 max-h-[calc(100vh-2rem)] overflow-y-auto 
                                bg-background/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl">
            <VerseContent verse={verse} />
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}