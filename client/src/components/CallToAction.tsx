import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CallToAction() {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!sectionRef.current) return;
    
    // Create parallax effect for the background
    gsap.to(".cta-bg-element", {
      y: -80,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5
      }
    });
  }, []);
  
  return (
    <section
      ref={sectionRef}
      className="py-20 sm:py-28 relative overflow-hidden"
    >
      {/* Background gradient and elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-background pointer-events-none"></div>
      <div className="cta-bg-element absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-primary/5 blur-[120px] opacity-70 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden bg-background/80 backdrop-blur-md shadow-xl border border-primary/20">
          <div className="flex flex-col lg:flex-row">
            <div className="p-8 sm:p-12 lg:p-16 flex-1">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-3xl sm:text-4xl font-playfair font-semibold mb-4 leading-tight"
              >
                Begin Your Spiritual Journey with GyanGita Today
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-lg text-muted-foreground mb-8"
              >
                Discover personalized verses, insightful commentaries, and a supportive community to guide you on your path to spiritual growth and inner peace.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-300"
                    onClick={() => {
                      const moodSection = document.getElementById('mood-section');
                      moodSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Start Now
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full sm:w-auto border-primary/20 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                    onClick={() => {
                      window.location.href = '/browse';
                    }}
                  >
                    Explore Verses
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </motion.div>
            </div>
            
            <div className="hidden lg:block lg:w-2/5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5"></div>
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="om-pattern" patternUnits="userSpaceOnUse" width="10" height="10" x="0" y="0">
                      <path d="M0,5 L10,5 M5,0 L5,10" stroke="currentColor" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#om-pattern)" className="text-primary" />
                </svg>
              </div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <svg width="200" height="200" viewBox="0 0 100 100" className="text-primary/40 fill-current">
                  <path d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm0 90C27.9 90 10 72.1 10 50S27.9 10 50 10s40 17.9 40 40-17.9 40-40 40z"/>
                  <path d="M50 20c-16.5 0-30 13.5-30 30s13.5 30 30 30 30-13.5 30-30-13.5-30-30-30zm0 50c-11 0-20-9-20-20s9-20 20-20 20 9 20 20-9 20-20 20z"/>
                </svg>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
