import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Share2 } from "lucide-react";

interface VerseCardProps {
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
  };
}

export default function VerseCard({ verse }: VerseCardProps) {
  const [showModal, setShowModal] = useState(false);

  const handleShare = () => {
    const text = `Bhagavad Gita - Chapter ${verse.chapter}, Verse ${verse.verse}\n\n${verse.transliteration}\n\nTranslation: ${verse.tej.ht}`;
    const url = `${window.location.origin}?chapter=${verse.chapter}&verse=${verse.verse}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n\n' + url)}`, '_blank');
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="bg-primary/5">
          <CardTitle className="font-playfair text-xl">
            Chapter {verse.chapter}, Verse {verse.verse}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div>
            <h3 className="font-semibold mb-2 text-primary">Sanskrit Verse</h3>
            <p className="text-lg font-sanskrit line-clamp-2">{verse.slok}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2 text-primary">Translation</h3>
            <p className="line-clamp-3">{verse.tej.ht}</p>
          </div>

          <Button onClick={() => setShowModal(true)} className="w-full">
            Read More
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-3xl h-[90vh] sm:h-[80vh]">
          <DialogHeader>
            <DialogTitle className="font-playfair text-2xl">
              Chapter {verse.chapter}, Verse {verse.verse}
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="verse" className="h-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="verse">Verse</TabsTrigger>
              <TabsTrigger value="translations">Translations</TabsTrigger>
              <TabsTrigger value="commentary">Commentary</TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[calc(100%-8rem)] mt-4">
              <TabsContent value="verse" className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2 text-primary">Sanskrit</h3>
                  <p className="text-xl font-sanskrit bg-muted/50 p-4 rounded-lg">{verse.slok}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-primary">Transliteration</h3>
                  <p className="text-lg bg-muted/50 p-4 rounded-lg">{verse.transliteration}</p>
                </div>
              </TabsContent>

              <TabsContent value="translations" className="space-y-6">
                {verse.tej && (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="font-medium text-primary mb-2">Swami Tejomayananda</p>
                    <p>{verse.tej.ht}</p>
                    {verse.tej.et && (
                      <p className="text-muted-foreground mt-2">{verse.tej.et}</p>
                    )}
                  </div>
                )}

                {verse.siva?.et && (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="font-medium text-primary mb-2">Swami Sivananda</p>
                    <p>{verse.siva.et}</p>
                  </div>
                )}

                {verse.purohit?.et && (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="font-medium text-primary mb-2">Shri Purohit Swami</p>
                    <p>{verse.purohit.et}</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="commentary" className="space-y-6">
                {verse.chinmay?.hc ? (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="font-medium text-primary mb-2">Swami Chinmayananda</p>
                    <p>{verse.chinmay.hc}</p>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground">No commentary available.</p>
                )}
              </TabsContent>
            </ScrollArea>

            <div className="mt-6 flex justify-end">
              <Button onClick={handleShare} className="gap-2">
                <Share2 className="w-5 h-5" />
                Share on WhatsApp
              </Button>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}