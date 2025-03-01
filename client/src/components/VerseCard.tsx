import { useState } from "react";
import { ArrowRight, ArrowRightCircle, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DialogHeader } from "@/components/ui/dialog";

// Combined interface for all possible verse properties
interface VerseProps {
  slok?: string;
  transliteration?: string;
  tej?: {
    ht?: string;
    et?: string;
  };
  siva?: {
    et?: string;
  };
  purohit?: {
    et?: string;
  };
  chinmay?: {
    hc?: string;
  };
  chapter?: number;
  verse?: number;
}

export default function VerseCard({ verse }: { verse: VerseProps }) {
  const [showModal, setShowModal] = useState(false);

  // Add a safety check for empty verse objects
  if (!verse || Object.keys(verse).length === 0) {
    return (
      <Card className="h-full">
        <CardContent className="p-6">
          <p className="text-muted-foreground">Verse data not available</p>
        </CardContent>
      </Card>
    );
  }

  // Function to handle WhatsApp sharing
  const handleShare = () => {
    const text = `${verse.slok || ''}\n\n${verse.transliteration || ''}\n\nBhagavad Gita Chapter ${verse.chapter}, Verse ${verse.verse}`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  };

  return (
    <Card className="h-full shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Bhagavad Gita {verse.chapter}:{verse.verse}</span>
          <Badge variant="outline">Chapter {verse.chapter}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div>
          <h3 className="font-semibold mb-2 text-primary">Sanskrit</h3>
          <p className="text-xl font-sanskrit bg-muted/50 p-4 rounded-lg">{verse.slok || "Sanskrit text not available"}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2 text-primary">Transliteration</h3>
          <p className="line-clamp-3">{verse.transliteration || "Transliteration not available"}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2 text-primary">Translation</h3>
          <p className="line-clamp-3">{verse.tej?.ht || verse.tej?.et || "Translation not available"}</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="w-full">
          Read More
        </Button>
      </CardContent>

      {showModal && (
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Bhagavad Gita Chapter {verse.chapter}, Verse {verse.verse}</DialogTitle>
            </DialogHeader>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2 text-primary">Sanskrit</h3>
                  <p className="text-xl font-sanskrit bg-muted/50 p-4 rounded-lg">{verse.slok || "Sanskrit text not available"}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-primary">Transliteration</h3>
                  <p className="text-lg bg-muted/50 p-4 rounded-lg">{verse.transliteration || "Transliteration not available"}</p>
                </div>
                <div className="space-y-6 mt-0">
                  <div>
                    <h3 className="font-semibold mb-2 text-primary">Translation</h3>
                    <p className="bg-muted/50 p-4 rounded-lg">{verse.tej?.ht || verse.tej?.et || "Translation not available"}</p>
                  </div>
                  {verse.siva?.et && (
                    <div>
                      <h3 className="font-semibold mb-2 text-primary">Sivananda Translation</h3>
                      <p className="bg-muted/50 p-4 rounded-lg">{verse.siva.et}</p>
                    </div>
                  )}
                </div>
                <div className="space-y-6 md:col-span-2">
                  {verse.purohit?.et && (
                    <div>
                      <h3 className="font-semibold mb-2 text-primary">Purohit Swami Translation</h3>
                      <p className="bg-muted/50 p-4 rounded-lg">{verse.purohit.et}</p>
                    </div>
                  )}
                  {verse.chinmay?.hc && (
                    <div>
                      <h3 className="font-semibold mb-2 text-primary">Chinmayananda Commentary</h3>
                      <p className="bg-muted/50 p-4 rounded-lg">{verse.chinmay.hc}</p>
                    </div>
                  )}
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
      )}
    </Card>
  );
}