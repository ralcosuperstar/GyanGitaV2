import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Download } from "lucide-react";
import { useState, useRef } from "react";
import { toPng } from 'html-to-image';

interface WisdomCardProps {
  quote: string;
  source: string;
  chapter?: number;
  verse?: number;
  theme?: string;
  layout?: "centered" | "minimal" | "gradient";
}

export function WisdomCard({ 
  quote, 
  source, 
  chapter, 
  verse, 
  theme = "minimal",
  layout = "centered" 
}: WisdomCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    if (!cardRef.current) return;
    
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1.0,
        backgroundColor: 'transparent',
      });
      
      if (navigator.share) {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], 'wisdom-card.png', { type: 'image/png' });
        
        await navigator.share({
          title: 'Wisdom from GyanGita',
          text: `${quote}\n\n- Bhagavad Gita ${chapter}:${verse}`,
          files: [file]
        });
      } else {
        const link = document.createElement('a');
        link.download = 'wisdom-card.png';
        link.href = dataUrl;
        link.click();
      }
    } catch (err) {
      console.error('Error sharing wisdom card:', err);
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1.0,
        backgroundColor: 'transparent',
      });
      
      const link = document.createElement('a');
      link.download = 'wisdom-card.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error downloading wisdom card:', err);
    }
  };

  return (
    <motion.div
      className="relative group"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <Card
        ref={cardRef}
        className={`
          relative overflow-hidden aspect-[4/3] p-6 sm:p-8
          ${layout === "gradient" ? "bg-gradient-to-br from-primary/20 via-primary/10 to-background" : ""}
          ${layout === "minimal" ? "bg-card/50 backdrop-blur-sm" : ""}
          ${layout === "centered" ? "bg-card border-primary/20" : ""}
        `}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-primary/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />

        {/* Quote content */}
        <div className="relative h-full flex flex-col justify-between">
          <div className="flex-1 flex items-center justify-center">
            <blockquote className="text-xl sm:text-2xl font-playfair text-foreground/90 text-balance text-center leading-relaxed">
              "{quote}"
            </blockquote>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Bhagavad Gita {chapter}:{verse}
            </p>
            {source && (
              <p className="text-xs text-primary/70 mt-1">{source}</p>
            )}
          </div>
        </div>

        {/* Share/Download overlay */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity"
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0 }}
        >
          <Button
            variant="outline"
            size="lg"
            className="bg-background/90 hover:bg-background"
            onClick={handleShare}
          >
            <Share2 className="h-5 w-5 mr-2" />
            Share
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="bg-background/90 hover:bg-background"
            onClick={handleDownload}
          >
            <Download className="h-5 w-5 mr-2" />
            Download
          </Button>
        </motion.div>
      </Card>
    </motion.div>
  );
}
