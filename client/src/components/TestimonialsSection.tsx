import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote: "Whatever happened, happened for the good. Whatever is happening, is happening for the good. Whatever will happen, will also happen for the good.",
    author: "Bhagavad Gita",
    chapter: "Chapter 2",
    image: "/assets/profile1.jpg" // These would be placeholder images
  },
  {
    quote: "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions.",
    author: "Bhagavad Gita",
    chapter: "Chapter 2, Verse 47",
    image: "/assets/profile2.jpg"
  },
  {
    quote: "For him who has conquered the mind, the mind is the best of friends; but for one who has failed to do so, his very mind will be the greatest enemy.",
    author: "Bhagavad Gita",
    chapter: "Chapter 6, Verse 6",
    image: "/assets/profile3.jpg"
  },
  {
    quote: "The mind is restless and difficult to restrain, but it is subdued by practice.",
    author: "Bhagavad Gita",
    chapter: "Chapter 6, Verse 35",
    image: "/assets/profile4.jpg"
  }
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  const next = () => {
    setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prev = () => {
    setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (!sectionRef.current) return;
    
    // Subtle floating animation for the decorative elements
    gsap.to(".quote-bg-1", {
      y: -20,
      x: 10,
      rotation: 5,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1
      }
    });
    
    gsap.to(".quote-bg-2", {
      y: 20,
      x: -15,
      rotation: -3,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5
      }
    });
    
    // Auto advance slides every 6 seconds
    const interval = setInterval(() => {
      next();
    }, 6000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="py-24 sm:py-32 relative overflow-hidden bg-primary/5"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="quote-bg-1 absolute right-10 top-10 w-[600px] h-[600px] rounded-full bg-primary/3 blur-[130px] opacity-70"></div>
        <div className="quote-bg-2 absolute -left-20 bottom-0 w-[500px] h-[500px] rounded-full bg-primary/3 blur-[100px] opacity-50"></div>
        
        <motion.div
          className="absolute top-10 left-10 text-primary/5 w-40 h-40"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <Quote size={160} />
        </motion.div>
        
        <motion.div
          className="absolute bottom-10 right-10 text-primary/5 w-40 h-40 rotate-180"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <Quote size={160} />
        </motion.div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-playfair font-semibold mb-6 leading-tight">
              Eternal <span className="text-primary">Wisdom</span> For Modern Life
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The timeless teachings of the Bhagavad Gita offer guidance that transcends centuries
            </p>
          </motion.div>
          
          <div className="relative flex flex-col items-center">
            <div className="w-full max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    duration: 0.4
                  }}
                  className="bg-background/80 backdrop-blur-sm rounded-2xl p-8 sm:p-10 border border-primary/10 shadow-lg"
                >
                  <div className="flex flex-col items-center text-center">
                    <Quote className="h-12 w-12 text-primary/50 mb-6" />
                    <p className="text-xl md:text-2xl font-medium leading-relaxed text-foreground mb-8 max-w-3xl">
                      "{testimonials[current].quote}"
                    </p>
                    <div className="mt-auto">
                      <p className="font-playfair text-lg font-semibold">{testimonials[current].author}</p>
                      <p className="text-sm text-muted-foreground">{testimonials[current].chapter}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            <div className="flex items-center justify-center mt-8 gap-4">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-10 h-10 bg-background/80 backdrop-blur-sm border-primary/20 hover:bg-primary/10 hover:text-primary"
                onClick={prev}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              <div className="flex space-x-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                      i === current ? "bg-primary" : "bg-primary/20"
                    }`}
                    onClick={() => setCurrent(i)}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
              
              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-10 h-10 bg-background/80 backdrop-blur-sm border-primary/20 hover:bg-primary/10 hover:text-primary"
                onClick={next}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
