import { useState } from "react";
import { ArrowRight, ArrowRightCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// Combined interface for all possible verse properties
interface VerseCardProps {
  verse?: {
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
  // Direct properties version
  slok?: string;
  translation?: string;
  transliteration?: string;
  chapter?: number;
  verse?: number;
  compact?: boolean;
}

export default function VerseCard(props: VerseCardProps) {
  const [open, setOpen] = useState(false);

  // Handle both property patterns
  if (props.verse) {
    // Format using verse object pattern
    const { verse } = props;
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
            <Dialog open={showModal} onOpenChange={setShowModal}>
              <DialogContent className="max-w-3xl h-[90vh] flex flex-col">
                <div className="px-6 py-4 bg-background border-b">
                  <div className="font-playfair text-2xl">
                    Chapter {verse.chapter}, Verse {verse.verse}
                  </div>
                </div>
                <div className="flex-1 overflow-auto px-6">
                  <div className="h-full py-4">
                    <div className="space-y-6 mt-0">
                      <div>
                        <h3 className="font-semibold mb-2 text-primary">Sanskrit</h3>
                        <p className="text-xl font-sanskrit bg-muted/50 p-4 rounded-lg">{verse.slok}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2 text-primary">Transliteration</h3>
                        <p className="text-lg bg-muted/50 p-4 rounded-lg">{verse.transliteration}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 bg-background border-t">
                  <Button onClick={handleShare} className="w-full gap-2">
                    <Share2 className="w-5 h-5" />
                    Share on WhatsApp
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </>
    );
  } else {
    // Format using direct properties pattern
    const { slok, translation, transliteration, chapter, verse, compact = false } = props;

    if (!slok || !translation || !transliteration || !chapter || !verse) {
      return null;
    }

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
            </div>
          </CardContent>
        </Card>

        {compact && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <div className="space-y-4">
                <Badge variant="outline" className="mb-2">
                  {chapter}:{verse}
                </Badge>
                <p className="font-playfair italic text-base">{slok}</p>
                <p className="text-xs text-muted-foreground">{transliteration}</p>
                <p className="text-base">{translation}</p>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </>
    );
  }
}