import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, Share2 } from "lucide-react";
import { BsWhatsapp } from "react-icons/bs";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { SiX } from "react-icons/si";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { trackEngagement } from "@/lib/analytics";

interface ShareDialogProps {
  verse: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ShareDialog({ verse, open, onOpenChange }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('preview');
  const { toast } = useToast();

  const handleCopy = async () => {
    const text = generateShareText();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    // Track copy event
    trackEngagement.shareVerse(verse.chapter, verse.verse, 'copy');

    toast({
      title: "Copied to clipboard",
      description: "You can now paste the text anywhere",
      duration: 2000,
    });
  };

  const handleShare = async (platform?: string) => {
    // Generate a shareable URL hash that includes verse info
    const baseUrl = window.location.origin;
    const verseHash = `#/verse/${verse.chapter}/${verse.verse}`;
    const shareUrl = `${baseUrl}${verseHash}`;

    // Create share text with different formats for different platforms
    const shareTitle = `Bhagavad Gita - Chapter ${verse.chapter}, Verse ${verse.verse}`;
    const shareQuote = verse.purohit?.et || verse.tej.et || verse.siva?.et || verse.tej.ht;
    let platformUrl = '';

    // Try native share if available and no platform specified
    if (!platform && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareQuote,
          url: shareUrl
        });
        trackEngagement.shareVerse(verse.chapter, verse.verse, 'native');
        return;
      } catch (err) {
        // Fall back to platform sharing if native share fails or is cancelled
      }
    }

    // Platform-specific sharing logic
    switch (platform) {
      case 'whatsapp':
        // WhatsApp: Keep it concise with quote and link
        const whatsappText = `"${shareQuote}"\n\n- Bhagavad Gita ${verse.chapter}.${verse.verse}\n\nRead more: ${shareUrl}`;
        platformUrl = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;
        break;
      case 'twitter':
        // Twitter: Short quote with hashtags
        const twitterText = `"${shareQuote.substring(0, 180)}..."\n\n- Bhagavad Gita ${verse.chapter}.${verse.verse}\n#BhagavadGita #Spirituality`;
        platformUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'facebook':
        platformUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareQuote)}`;
        break;
      case 'linkedin':
        platformUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
    }

    if (platformUrl) {
      window.open(platformUrl, '_blank', 'noopener,noreferrer');
      trackEngagement.shareVerse(verse.chapter, verse.verse, platform);
    }
  };

  const generateShareText = () => {
    const shareQuote = verse.purohit?.et || verse.tej.et || verse.siva?.et || verse.tej.ht;
    const baseUrl = window.location.origin;
    const verseHash = `#/verse/${verse.chapter}/${verse.verse}`;
    const shareUrl = `${baseUrl}${verseHash}`;

    return `"${shareQuote}"\n\n- Bhagavad Gita, Chapter ${verse.chapter}, Verse ${verse.verse}\n\nRead more: ${shareUrl}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[600px] mx-auto my-4 p-0 rounded-xl overflow-hidden">
        <div className="relative">
          {/* Decorative border effect */}
          <div className="absolute inset-0 border border-primary/10 rounded-xl pointer-events-none"></div>
          <div className="absolute inset-[1px] border border-primary/5 rounded-xl pointer-events-none"></div>

          <div className="px-4 sm:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <DialogHeader className="space-y-4">
              <DialogTitle className="text-xl sm:text-2xl font-playfair text-foreground">
                Share Verse
              </DialogTitle>
            </DialogHeader>

            <Tabs 
              defaultValue="preview" 
              className="flex-1 flex flex-col overflow-hidden"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="w-full grid grid-cols-2 p-1 bg-muted/5 border-b">
                <TabsTrigger value="preview" className="data-[state=active]:bg-primary/10">
                  Preview
                </TabsTrigger>
                <TabsTrigger value="text" className="data-[state=active]:bg-primary/10">
                  Text
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="p-4 sm:p-6">
                    <TabsContent value="preview" className="mt-0 mb-4">
                      <div className="space-y-6">
                        {/* Share Preview Card */}
                        <Card className="overflow-hidden border border-primary/10">
                          <div className="p-6 space-y-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="px-2 py-1 rounded-md bg-primary/10 text-primary font-medium">
                                Ch {verse.chapter}
                              </span>
                              <span className="px-2 py-1 rounded-md bg-primary/10 text-primary font-medium">
                                V {verse.verse}
                              </span>
                            </div>
                            <p className="text-lg sm:text-xl leading-relaxed">
                              {verse.purohit?.et || verse.tej.et || verse.siva?.et || verse.tej.ht}
                            </p>
                            <div className="pt-4 border-t border-primary/10">
                              <p className="font-sanskrit text-base leading-relaxed">
                                {verse.slok}
                              </p>
                            </div>
                          </div>
                        </Card>

                        {/* Share Options */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <Button
                            className="bg-[#25D366] hover:bg-[#25D366]/90 text-white"
                            onClick={() => handleShare('whatsapp')}
                          >
                            <BsWhatsapp className="h-4 w-4 mr-2" />
                            WhatsApp
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleShare('twitter')}
                          >
                            <SiX className="h-4 w-4 mr-2" />
                            Twitter
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleShare('facebook')}
                          >
                            <FaFacebookF className="h-4 w-4 mr-2" />
                            Facebook
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleShare('linkedin')}
                          >
                            <FaLinkedinIn className="h-4 w-4 mr-2" />
                            LinkedIn
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="text" className="mt-0 mb-4">
                      <div className="space-y-6">
                        <Card className="overflow-hidden border border-primary/10">
                          <div className="p-6">
                            <pre className="whitespace-pre-wrap text-sm">
                              {generateShareText()}
                            </pre>
                          </div>
                        </Card>

                        <div className="flex gap-3">
                          {navigator.share && (
                            <Button
                              className="flex-1"
                              onClick={() => handleShare()}
                            >
                              <Share2 className="h-4 w-4 mr-2" />
                              Share
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={handleCopy}
                          >
                            {copied ? (
                              <>
                                <Check className="h-4 w-4 mr-2" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4 mr-2" />
                                Copy Text
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </div>
                </ScrollArea>
              </div>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}