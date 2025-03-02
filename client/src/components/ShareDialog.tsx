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
      title: t('share.copied'),
      description: t('share.copiedDesc'),
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

  const generateShareText = (lang: 'sanskrit' | 'hindi' | 'english') => {
    let text = '';
    const attribution = `\n\n- Bhagavad Gita, Chapter ${verse.chapter}, Verse ${verse.verse}`;

    switch (lang) {
      case 'sanskrit':
        text = `${verse.slok}\n\n${verse.transliteration}\n\n${verse.tej.ht}`;
        break;
      case 'hindi':
        text = `${verse.tej.ht}\n\n${verse.slok}`;
        break;
      case 'english':
        text = `${verse.tej.et || verse.transliteration}\n\n${verse.slok}`;
        break;
    }
    return text + attribution;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] space-y-6">
        <DialogHeader>
          <DialogTitle>{t('share.title')}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="hindi" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="hindi">{t('share.languages.hindi')}</TabsTrigger>
            <TabsTrigger value="sanskrit">{t('share.languages.sanskrit')}</TabsTrigger>
            <TabsTrigger value="english">{t('share.languages.english')}</TabsTrigger>
          </TabsList>

          {['hindi', 'sanskrit', 'english'].map((lang) => (
            <TabsContent key={lang} value={lang} className="space-y-4">
              <div className="border rounded-lg bg-muted/5 p-6 space-y-4">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {generateShareText(lang as any).split('\n').map((line, i) => (
                    <p key={i} className={i === 0 ? 'font-medium leading-relaxed' : 'text-muted-foreground leading-relaxed'}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => handleShare('whatsapp', generateShareText(lang as any))}
                >
                  <BsWhatsapp className="h-4 w-4" />
                  WhatsApp
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => handleShare('twitter', generateShareText(lang as any))}
                >
                  <BsTwitter className="h-4 w-4" />
                  Twitter
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => handleShare('facebook', generateShareText(lang as any))}
                >
                  <FaFacebookF className="h-4 w-4" />
                  Facebook
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => handleShare('linkedin', generateShareText(lang as any))}
                >
                  <FaLinkedinIn className="h-4 w-4" />
                  LinkedIn
                </Button>
              </div>

              <Button
                variant="secondary"
                className="w-full gap-2"
                onClick={() => handleCopy(generateShareText(lang as any))}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {t('share.copyText')}
              </Button>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}