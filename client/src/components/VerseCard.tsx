import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Book, ArrowRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ShareDialog from "./ShareDialog";
import VerseModal from "./VerseModal";
import { motion } from 'framer-motion';

interface VerseCardProps {
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
  };
  showActions?: boolean;
  variant?: 'compact' | 'detailed';
}

export default function VerseCard({
  verse,
  showActions = true,
  variant = 'compact'
}: VerseCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  // Get all available translations
  const translations = [
    { author: 'Tej', text: verse.tej.et },
    ...(verse.purohit?.et ? [{ author: 'Purohit', text: verse.purohit.et }] : []),
    ...(verse.siva?.et ? [{ author: 'Siva', text: verse.siva.et }] : [])
  ];

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="h-full"
    >
      <Card className="h-full backdrop-blur-lg bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="flex flex-col h-full p-6 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-30" />

          <div className="relative z-10 flex flex-col h-full">
            {/* Header with Chapter/Verse Numbers */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-lg backdrop-blur-md bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/20">
                  <span className="text-sm text-white/60">Ch.{verse.chapter}</span>
                </div>
                <div className="px-3 py-1.5 rounded-lg backdrop-blur-md bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/20">
                  <span className="text-sm text-white/60">V.{verse.verse}</span>
                </div>
              </div>
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="main" className="flex-grow">
              <TabsList className="mb-4 bg-white/5 border border-white/10">
                <TabsTrigger value="main">Main</TabsTrigger>
                <TabsTrigger value="sanskrit">Sanskrit</TabsTrigger>
                {translations.length > 1 && (
                  <TabsTrigger value="translations">More</TabsTrigger>
                )}
                {verse.chinmay?.hc && (
                  <TabsTrigger value="commentary">Commentary</TabsTrigger>
                )}
              </TabsList>

              {/* Main Translation */}
              <TabsContent value="main" className="mt-0">
                <div className="backdrop-blur-sm bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-lg text-white/90 leading-relaxed font-light">
                    {verse.purohit?.et || verse.tej.et || verse.siva?.et}
                  </p>
                </div>
              </TabsContent>

              {/* Sanskrit Text */}
              <TabsContent value="sanskrit" className="mt-0">
                <div className="backdrop-blur-sm bg-white/5 rounded-lg p-4 border border-white/10 space-y-4">
                  <p className="text-xl font-sanskrit text-white/90 leading-relaxed">
                    {verse.slok}
                  </p>
                  <p className="text-sm italic text-white/70">
                    {verse.transliteration}
                  </p>
                </div>
              </TabsContent>

              {/* Additional Translations */}
              {translations.length > 1 && (
                <TabsContent value="translations" className="mt-0">
                  <div className="space-y-4">
                    {translations.map((trans, idx) => (
                      <div key={idx} className="backdrop-blur-sm bg-white/5 rounded-lg p-4 border border-white/10">
                        <h4 className="text-sm font-medium text-primary/80 mb-2">{trans.author}</h4>
                        <p className="text-white/90">{trans.text}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              )}

              {/* Commentary */}
              {verse.chinmay?.hc && (
                <TabsContent value="commentary" className="mt-0">
                  <div className="backdrop-blur-sm bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="text-sm font-medium text-primary/80 mb-2">Chinmay Commentary</h4>
                    <p className="text-white/90 text-sm leading-relaxed">
                      {verse.chinmay.hc}
                    </p>
                  </div>
                </TabsContent>
              )}
            </Tabs>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 mt-4 border-t border-white/10">
              <Button
                onClick={() => setShowModal(true)}
                className="flex-1 bg-gradient-to-r from-primary/90 to-primary/80 hover:from-primary/80 hover:to-primary/70 
                          border border-primary/30 shadow-lg hover:shadow-xl backdrop-blur-sm 
                          transition-all duration-300 text-white py-5 group"
              >
                <span className="flex items-center justify-center">
                  <Book className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
                  Read Full Verse
                  <ArrowRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </span>
              </Button>

              {showActions && (
                <Button
                  variant="outline"
                  onClick={() => setShowShareDialog(true)}
                  className="px-5 backdrop-blur-md bg-gradient-to-r from-white/10 to-white/5 
                            border border-white/20 hover:bg-white/10 hover:border-white/30 
                            shadow-lg hover:shadow-xl transition-all duration-300 py-5 group"
                >
                  <Share2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <VerseModal
        verse={verse}
        open={showModal}
        onOpenChange={setShowModal}
      />

      <ShareDialog
        verse={verse}
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
      />
    </motion.div>
  );
}