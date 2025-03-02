import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check } from "lucide-react";
import { BsWhatsapp, BsTwitter } from "react-icons/bs";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language-context";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ShareDialogProps {
  verse: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ShareDialog({ verse, open, onOpenChange }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied to clipboard",
      description: "You can now paste the text anywhere",
      duration: 2000,
    });
  };

  const handleShare = (platform: string, text: string) => {
    const url = `${window.location.origin}/verse/${verse.chapter}/${verse.verse}`;
    const shareText = encodeURIComponent(`${text}\n\nShared via GyanGita - ${url}`);

    let shareUrl = '';
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${shareText}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${shareText}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${shareText}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
    }

    window.open(shareUrl, '_blank');
  };

  const generateVerseText = () => {
    return `${verse.slok}\n\n${verse.tej.ht}\n\n- Bhagavad Gita, Chapter ${verse.chapter}, Verse ${verse.verse}`;
  };

  const generateCommentaryText = () => {
    let text = `${verse.slok}\n\n${verse.tej.ht}`;

    if (verse.chinmay?.hc) {
      text += `\n\nCommentary by Swami Chinmayananda:\n${verse.chinmay.hc}`;
    }

    return `${text}\n\n- Bhagavad Gita, Chapter ${verse.chapter}, Verse ${verse.verse}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <div className="flex flex-col h-[85vh] sm:h-auto">
          <DialogHeader className="p-4 sm:p-6 border-b">
            <DialogTitle>Share Verse</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="verse" className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="w-full grid grid-cols-2 p-1 bg-muted/5 border-b">
              <TabsTrigger value="verse">Verse & Translation</TabsTrigger>
              <TabsTrigger value="commentary">With Commentary</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4 sm:p-6 space-y-6">
                  <TabsContent value="verse" className="mt-0 space-y-4">
                    <div className="border rounded-lg bg-muted/5 p-4 sm:p-6 space-y-4">
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        {generateVerseText().split('\n').map((line, i) => (
                          <p key={i} className={i === 0 ? 'font-medium leading-relaxed font-sanskrit' : 'text-muted-foreground leading-relaxed'}>
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleShare('whatsapp', generateVerseText())}
                      >
                        <BsWhatsapp className="h-4 w-4" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleShare('twitter', generateVerseText())}
                      >
                        <BsTwitter className="h-4 w-4" />
                        <span className="hidden sm:inline">Twitter</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleShare('facebook', generateVerseText())}
                      >
                        <FaFacebookF className="h-4 w-4" />
                        <span className="hidden sm:inline">Facebook</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleShare('linkedin', generateVerseText())}
                      >
                        <FaLinkedinIn className="h-4 w-4" />
                        <span className="hidden sm:inline">LinkedIn</span>
                      </Button>
                    </div>

                    <Button
                      variant="secondary"
                      className="w-full gap-2"
                      onClick={() => handleCopy(generateVerseText())}
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      Copy Text
                    </Button>
                  </TabsContent>

                  <TabsContent value="commentary" className="mt-0 space-y-4">
                    <div className="border rounded-lg bg-muted/5 p-4 sm:p-6 space-y-4">
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        {generateCommentaryText().split('\n').map((line, i) => (
                          <p key={i} className={i === 0 ? 'font-medium leading-relaxed font-sanskrit' : 'text-muted-foreground leading-relaxed'}>
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleShare('whatsapp', generateCommentaryText())}
                      >
                        <BsWhatsapp className="h-4 w-4" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleShare('twitter', generateCommentaryText())}
                      >
                        <BsTwitter className="h-4 w-4" />
                        <span className="hidden sm:inline">Twitter</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleShare('facebook', generateCommentaryText())}
                      >
                        <FaFacebookF className="h-4 w-4" />
                        <span className="hidden sm:inline">Facebook</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleShare('linkedin', generateCommentaryText())}
                      >
                        <FaLinkedinIn className="h-4 w-4" />
                        <span className="hidden sm:inline">LinkedIn</span>
                      </Button>
                    </div>

                    <Button
                      variant="secondary"
                      className="w-full gap-2"
                      onClick={() => handleCopy(generateCommentaryText())}
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      Copy Text
                    </Button>
                  </TabsContent>
                </div>
              </ScrollArea>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}