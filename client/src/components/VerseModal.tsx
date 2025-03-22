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

  // Get all available translations
  const translations: Translation[] = [
    verse.purohit?.et ? { author: 'Purohit', text: verse.purohit.et } : null,
    { author: 'Tej', text: verse.tej.et },
    verse.siva?.et ? { author: 'Siva', text: verse.siva.et } : null
  ].filter((t): t is Translation => t !== null);

  // Create available tabs based on content
  const tabs: Tab[] = [
    { id: 'translation', label: 'Translation' },
    { id: 'sanskrit', label: 'Sanskrit' },
    verse.tej.ht ? { id: 'hindi', label: 'हिंदी' } : null,
    verse.chinmay?.hc ? { id: 'commentary', label: 'Commentary' } : null
  ].filter((tab): tab is Tab => tab !== null);

  const handleCopy = useCallback(async () => {
    const textToCopy = `${verse.purohit?.et || verse.tej.et || verse.siva?.et}\n\n${verse.slok}\n\n${verse.transliteration}`;
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
    <div className="relative">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-medium text-white">
            Chapter {verse.chapter}, Verse {verse.verse}
          </h2>
          <p className="text-sm text-white/60">Bhagavad Gita</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="translation" className="space-y-6">
        <TabsList className="flex w-full border-b border-white/10">
          {tabs.map(tab => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex-1 h-12 text-sm font-medium text-white/70
                        data-[state=active]:bg-transparent 
                        data-[state=active]:border-b-2
                        data-[state=active]:border-primary 
                        data-[state=active]:text-primary
                        rounded-none"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Translation Content */}
        <TabsContent value="translation" className="pt-4 space-y-6">
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
              <p className="text-lg sm:text-xl md:text-2xl leading-relaxed text-white/90">
                {trans.text}
              </p>
            </motion.div>
          ))}
        </TabsContent>

        {/* Sanskrit Content */}
        <TabsContent value="sanskrit" className="pt-4 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-white/60">
                Sanskrit Text
              </h3>
              <p className="text-xl sm:text-2xl md:text-3xl leading-relaxed font-sanskrit text-white/90">
                {verse.slok}
              </p>
            </div>

            <div className="space-y-2 pt-6 border-t border-white/10">
              <h3 className="text-sm font-medium text-white/60">
                Transliteration
              </h3>
              <p className="text-base sm:text-lg md:text-xl italic text-white/80">
                {verse.transliteration}
              </p>
            </div>
          </motion.div>
        </TabsContent>

        {/* Hindi Content */}
        {verse.tej.ht && (
          <TabsContent value="hindi" className="pt-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <h3 className="text-sm font-medium text-white/60">
                हिंदी अनुवाद
              </h3>
              <p className="text-lg sm:text-xl md:text-2xl leading-relaxed text-white/90">
                {verse.tej.ht}
              </p>
            </motion.div>
          </TabsContent>
        )}

        {/* Commentary Content */}
        {verse.chinmay?.hc && (
          <TabsContent value="commentary" className="pt-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <h3 className="text-sm font-medium text-white/60">
                Commentary
              </h3>
              <div className="prose prose-invert max-w-none">
                <p className="text-base sm:text-lg leading-relaxed text-white/90 whitespace-pre-wrap">
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
        className="flex flex-col sm:flex-row gap-3 pt-6 mt-6 border-t border-white/10"
      >
        <Button
          className="flex-1 bg-gradient-to-r from-primary/90 to-primary/80 
                    hover:from-primary/80 hover:to-primary/70
                    border border-primary/30 shadow-lg hover:shadow-xl 
                    backdrop-blur-sm transition-all duration-300 
                    h-12 sm:h-14 text-white group"
          onClick={() => setShowShareDialog(true)}
        >
          <span className="flex items-center justify-center text-sm sm:text-base">
            <Share2 className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
            Share Verse
            <ArrowRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </span>
        </Button>

        <Button
          variant="outline"
          className="flex-1 backdrop-blur-md bg-gradient-to-r from-white/10 to-white/5
                    border border-white/20 hover:bg-white/10 hover:border-white/30
                    shadow-lg hover:shadow-xl transition-all duration-300 
                    h-12 sm:h-14 group"
          onClick={handleCopy}
        >
          <span className="flex items-center justify-center text-sm sm:text-base">
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                Copy Text
              </>
            )}
          </span>
        </Button>
      </motion.div>

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
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent 
            className="w-[calc(100%-1rem)] sm:w-[calc(100%-4rem)] max-w-4xl mx-auto 
                     my-2 sm:my-4 max-h-[calc(100vh-1rem)] sm:max-h-[calc(100vh-2rem)] 
                     overflow-y-auto bg-background/95 backdrop-blur-xl
                     border border-white/10 rounded-lg sm:rounded-xl shadow-2xl
                     p-4 sm:p-6 md:p-8"
          >
            <VerseContent verse={verse} />
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}