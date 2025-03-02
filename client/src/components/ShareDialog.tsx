import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check } from "lucide-react";
import { BsWhatsapp, BsTwitter } from "react-icons/bs";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language-context";

interface ShareDialogProps {
  verse: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ShareDialog({ verse, open, onOpenChange }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

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
      <DialogContent className="sm:max-w-[600px] space-y-6">
        <DialogHeader>
          <DialogTitle>Share Verse</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="verse" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="verse">Verse & Translation</TabsTrigger>
            <TabsTrigger value="commentary">With Commentary</TabsTrigger>
          </TabsList>

          <TabsContent value="verse" className="space-y-4">
            <div className="border rounded-lg bg-muted/5 p-6 space-y-4">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {generateVerseText().split('\n').map((line, i) => (
                  <p key={i} className={i === 0 ? 'font-medium leading-relaxed font-sanskrit' : 'text-muted-foreground leading-relaxed'}>
                    {line}
                  </p>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => handleShare('whatsapp', generateVerseText())}
              >
                <BsWhatsapp className="h-4 w-4" />
                WhatsApp
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => handleShare('twitter', generateVerseText())}
              >
                <BsTwitter className="h-4 w-4" />
                Twitter
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => handleShare('facebook', generateVerseText())}
              >
                <FaFacebookF className="h-4 w-4" />
                Facebook
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => handleShare('linkedin', generateVerseText())}
              >
                <FaLinkedinIn className="h-4 w-4" />
                LinkedIn
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

          <TabsContent value="commentary" className="space-y-4">
            <div className="border rounded-lg bg-muted/5 p-6 space-y-4">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {generateCommentaryText().split('\n').map((line, i) => (
                  <p key={i} className={i === 0 ? 'font-medium leading-relaxed font-sanskrit' : 'text-muted-foreground leading-relaxed'}>
                    {line}
                  </p>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => handleShare('whatsapp', generateCommentaryText())}
              >
                <BsWhatsapp className="h-4 w-4" />
                WhatsApp
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => handleShare('twitter', generateCommentaryText())}
              >
                <BsTwitter className="h-4 w-4" />
                Twitter
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => handleShare('facebook', generateCommentaryText())}
              >
                <FaFacebookF className="h-4 w-4" />
                Facebook
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => handleShare('linkedin', generateCommentaryText())}
              >
                <FaLinkedinIn className="h-4 w-4" />
                LinkedIn
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
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}