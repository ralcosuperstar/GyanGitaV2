import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    quote: "This app helped me find inner peace during my most stressful times. The verses recommended were exactly what I needed.",
    author: "Mindful Seeker",
    role: "Daily Practitioner",
    image: "/assets/profile1.jpg"
  },
  {
    quote: "The mood-based recommendations are incredible. Each verse feels personally chosen for my situation.",
    author: "Spiritual Explorer",
    role: "Meditation Teacher",
    image: "/assets/profile2.jpg"
  },
  {
    quote: "Combining ancient wisdom with modern technology in such a beautiful way. This app is a bridge between centuries.",
    author: "Digital Yogi",
    role: "Wellness Coach",
    image: "/assets/profile3.jpg"
  },
  {
    quote: "The interface is so calming, and the verses are life-changing. It's like having a spiritual guide in your pocket.",
    author: "Peace Finder",
    role: "Yoga Instructor",
    image: "/assets/profile4.jpg"
  }
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const next = () => {
    setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prev = () => {
    setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      ref={containerRef}
      className="py-24 sm:py-32 relative overflow-hidden bg-primary/5"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute right-10 top-10 w-[600px] h-[600px] rounded-full bg-primary/3 blur-[130px] opacity-70"></div>
        <div className="absolute -left-20 bottom-0 w-[500px] h-[500px] rounded-full bg-primary/3 blur-[100px] opacity-50"></div>

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
              Discover how others have found peace and clarity through ancient teachings
            </p>
          </motion.div>

          <div className="relative">
            {/* Fixed height container to prevent layout shifts */}
            <div className="w-full max-w-4xl mx-auto min-h-[400px] relative">
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
                  className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-2xl p-8 sm:p-10 border border-primary/10 shadow-lg"
                >
                  <div className="flex flex-col items-center text-center h-full justify-center">
                    <Quote className="h-12 w-12 text-primary/50 mb-6" />
                    <p className="text-xl md:text-2xl font-medium leading-relaxed text-foreground mb-8 max-w-3xl">
                      "{testimonials[current].quote}"
                    </p>
                    <div className="mt-auto">
                      <p className="font-playfair text-lg font-semibold">{testimonials[current].author}</p>
                      <p className="text-sm text-muted-foreground">{testimonials[current].role}</p>
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