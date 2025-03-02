import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { generateQuote } from "@/services/quoteGenerator";
import { Facebook, Twitter, Linkedin, Copy, Check } from "lucide-react";
import { BsWhatsapp } from "react-icons/bs";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language-context";

interface ShareDialogProps {
  verse: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ShareDialog({ verse, open, onOpenChange }: ShareDialogProps) {
  const [style, setStyle] = useState({
    template: 'minimal',
    language: 'english',
    showAttribution: true
  });
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const quote = generateQuote(verse, style as any);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(quote.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: t('share.copied'),
      description: t('share.copiedDesc'),
      duration: 2000,
    });
  };

  const handleShare = (platform: string) => {
    const url = window.location.origin;
    const text = encodeURIComponent(quote.socialText);

    let shareUrl = '';
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${text}\n\n${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
    }

    window.open(shareUrl, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t('share.title')}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="preview">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview">{t('share.preview')}</TabsTrigger>
            <TabsTrigger value="customize">{t('share.customize')}</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-4">
            <div 
              className="p-6 bg-muted rounded-lg"
              dangerouslySetInnerHTML={{ __html: quote.html }}
            />

            <div className="grid grid-cols-4 gap-2">
              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4"
                onClick={() => handleShare('whatsapp')}
              >
                <BsWhatsapp className="h-5 w-5" />
                <span className="text-xs">WhatsApp</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4"
                onClick={() => handleShare('twitter')}
              >
                <Twitter className="h-5 w-5" />
                <span className="text-xs">Twitter</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4"
                onClick={() => handleShare('facebook')}
              >
                <Facebook className="h-5 w-5" />
                <span className="text-xs">Facebook</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4"
                onClick={() => handleShare('linkedin')}
              >
                <Linkedin className="h-5 w-5" />
                <span className="text-xs">LinkedIn</span>
              </Button>
            </div>

            <Button 
              variant="secondary" 
              className="w-full gap-2"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {t('share.copyText')}
            </Button>
          </TabsContent>

          <TabsContent value="customize" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t('share.template')}</Label>
                <RadioGroup
                  defaultValue={style.template}
                  onValueChange={(value) => setStyle({ ...style, template: value as any })}
                  className="grid grid-cols-3 gap-2"
                >
                  <div>
                    <RadioGroupItem
                      value="minimal"
                      id="minimal"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="minimal"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <span className="text-sm font-semibold">{t('share.templates.minimal')}</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="decorative"
                      id="decorative"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="decorative"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <span className="text-sm font-semibold">{t('share.templates.decorative')}</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="traditional"
                      id="traditional"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="traditional"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <span className="text-sm font-semibold">{t('share.templates.traditional')}</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>{t('share.language')}</Label>
                <RadioGroup
                  defaultValue={style.language}
                  onValueChange={(value) => setStyle({ ...style, language: value as any })}
                  className="grid grid-cols-3 gap-2"
                >
                  <div>
                    <RadioGroupItem
                      value="sanskrit"
                      id="sanskrit"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="sanskrit"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <span className="text-sm font-semibold">{t('share.languages.sanskrit')}</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="english"
                      id="english"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="english"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <span className="text-sm font-semibold">{t('share.languages.english')}</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="hindi"
                      id="hindi"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="hindi"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <span className="text-sm font-semibold">{t('share.languages.hindi')}</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="attribution">{t('share.showAttribution')}</Label>
                <Switch
                  id="attribution"
                  checked={style.showAttribution}
                  onCheckedChange={(checked) => setStyle({ ...style, showAttribution: checked })}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}