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
        <DialogContent className="max-w-3xl h-[90vh] flex flex-col">
          <DialogHeader className="px-6 py-4 bg-background border-b">
            <DialogTitle className="font-playfair text-2xl">
              Chapter {verse.chapter}, Verse {verse.verse}
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="verse" className="flex-1 flex flex-col min-h-0">
            <TabsList className="w-full grid grid-cols-3 px-6 bg-background">
              <TabsTrigger value="verse">Verse</TabsTrigger>
              <TabsTrigger value="translations">Translations</TabsTrigger>
              <TabsTrigger value="commentary">Commentary</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-auto px-6">
              <ScrollArea className="h-full py-4">
                <TabsContent value="verse" className="space-y-6 mt-0">
                  <div>
                    <h3 className="font-semibold mb-2 text-primary">Sanskrit</h3>
                    <p className="text-xl font-sanskrit bg-muted/50 p-4 rounded-lg">{verse.slok}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-primary">Transliteration</h3>
                    <p className="text-lg bg-muted/50 p-4 rounded-lg">{verse.transliteration}</p>
                  </div>
                </TabsContent>

                <TabsContent value="translations" className="space-y-6 mt-0">
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

                <TabsContent value="commentary" className="space-y-6 mt-0">
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
            </div>
          </Tabs>

          <div className="px-6 py-4 bg-background border-t">
            <Button onClick={handleShare} className="w-full gap-2">
              <Share2 className="w-5 h-5" />
              Share on WhatsApp
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

interface VerseCardProps {
  slok: string;
  translation: string;
  transliteration: string;
  chapter: number;
  verse: number;
  compact?: boolean;
}

export default function VerseCard({ 
  slok, 
  translation, 
  transliteration, 
  chapter, 
  verse,
  compact = false
}: VerseCardProps) {
  const [open, setOpen] = useState(false);
  
  const slokPreview = compact ? `${slok.substring(0, 80)}${slok.length > 80 ? '...' : ''}` : slok;
  const translationPreview = compact ? 
    `${translation.substring(0, 100)}${translation.length > 100 ? '...' : ''}` : 
    translation;
  
  return (
    <>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/20">
        <CardContent className={compact ? "p-4" : "p-6"}>
          <div className="flex justify-between items-start mb-3">
            <Badge variant="outline" className="mb-2">
              {chapter}:{verse}
            </Badge>
            {compact && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-primary" 
                onClick={() => setOpen(true)}
              >
                <span className="sr-only">Read more</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="space-y-3">
            <p className="font-playfair italic text-sm md:text-base">{slokPreview}</p>
            
            {!compact && (
              <p className="text-xs text-muted-foreground">{transliteration}</p>
            )}
            
            <p className="text-sm md:text-base">{translationPreview}</p>
            
            {!compact && (
              <div className="flex justify-end pt-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary" 
                  onClick={() => setOpen(true)}
                >
                  Read full verse <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Chapter {chapter}, Verse {verse}</span>
              <Badge variant="outline">BG {chapter}.{verse}</Badge>
            </DialogTitle>
            <DialogDescription>
              Bhagavad Gita
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 my-4">
            <div className="p-4 bg-primary/5 rounded-lg">
              <h3 className="font-playfair text-lg mb-2">Sanskrit Verse</h3>
              <p className="font-playfair italic leading-relaxed">{slok}</p>
            </div>
            
            <div className="p-4 border border-border rounded-lg">
              <h3 className="font-medium text-lg mb-2">Transliteration</h3>
              <p className="leading-relaxed text-muted-foreground">{transliteration}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-2">Translation</h3>
              <p className="leading-relaxed">{translation}</p>
            </div>
          </div>
          
          <DialogFooter className="flex-col sm:flex-row gap-2">
            {chapter > 1 || verse > 1 ? (
              <Button variant="outline" size="sm">
                Previous Verse
              </Button>
            ) : null}
            
            <span className="flex-1"></span>
            
            <Button variant="outline" size="sm">
              Copy Reference
            </Button>
            
            <Button>
              Next Verse
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
