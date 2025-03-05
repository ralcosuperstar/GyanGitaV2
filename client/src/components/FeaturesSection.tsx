import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  BookOpen, 
  Heart, 
  Brain, 
  Lightbulb, 
  Compass, 
  Users, 
  Globe,
  Sunrise
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

gsap.registerPlugin(ScrollTrigger);

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  delay = 0,
  index
}: { 
  icon: any, 
  title: string, 
  description: string,
  delay?: number,
  index: number
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ 
      duration: 0.5, 
      delay: delay,
      type: "spring",
      stiffness: 100,
      damping: 15
    }}
    whileHover={{ 
      y: -8, 
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      backgroundColor: "var(--primary-5)"
    }}
    className={`bg-card/5 backdrop-blur-sm rounded-2xl p-8 border border-primary/10
      transition-all duration-300 group hover:border-primary/30
      ${index % 3 === 1 ? 'md:mt-12' : index % 3 === 2 ? 'md:mt-24' : ''}`}
  >
    <div className="rounded-xl bg-primary/10 p-4 w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
      <Icon className="w-8 h-8 text-primary" />
    </div>
    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">{title}</h3>
    <p className="text-muted-foreground leading-relaxed">{description}</p>
  </motion.div>
);

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  
  useEffect(() => {
    if (!sectionRef.current) return;
    
    // Animate the section title when it comes into view
    gsap.fromTo(
      ".feature-title",
      { 
        opacity: 0,
        y: 30
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: ".feature-title",
          start: "top 80%",
          end: "bottom 60%",
          toggleActions: "play none none none"
        }
      }
    );
    
    // Create a floating animation for the background pattern
    gsap.to(".features-bg-pattern", {
      y: -30,
      rotation: 10,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5
      }
    });
    
  }, []);
  
  const features = [
    {
      icon: Brain,
      title: "Personalized Guidance",
      description: "Receive verses that resonate with your current emotional state and life situations for meaningful guidance."
    },
    {
      icon: Heart,
      title: "Emotional Support",
      description: "Find solace and inner strength through ancient wisdom during challenging times in your personal journey."
    },
    {
      icon: BookOpen,
      title: "Multiple Translations",
      description: "Access clear translations and interpretations from renowned scholars to deepen your understanding."
    },
    {
      icon: Compass,
      title: "Daily Inspiration",
      description: "Start each day with a carefully selected verse for spiritual growth and mindful reflection."
    },
    {
      icon: Users,
      title: "Community Connect",
      description: "Share insights and discuss verses with fellow spiritual seekers to expand your perspective."
    },
    {
      icon: Lightbulb,
      title: "Modern Context",
      description: "Learn how ancient teachings apply to contemporary challenges in your everyday life."
    },
    {
      icon: Globe,
      title: "Multilingual Access",
      description: "Experience the Bhagavad Gita in multiple languages to connect with its message in your preferred tongue."
    },
    {
      icon: Sunrise,
      title: "Visual Meditation",
      description: "Engage with beautiful imagery and calm aesthetics designed to elevate your spiritual experience."
    }
  ];
  
  return (
    <section 
      ref={sectionRef}
      className="py-32 relative overflow-hidden bg-gradient-to-b from-background via-muted/10 to-background"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="features-bg-pattern absolute right-0 top-1/3 w-[800px] h-[800px] rounded-full bg-primary/3 blur-[150px] opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/10 to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-4 py-1.5 border border-primary/20 rounded-full text-sm font-medium text-primary/80 bg-primary/5 mb-4"
          >
            Modern Interface, Timeless Wisdom
          </motion.div>
          
          <h2 className="feature-title text-4xl md:text-5xl font-playfair font-semibold mb-6 leading-tight">
            Why Choose <span className="text-primary">GyanGita</span> For Your Spiritual Journey
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover how our thoughtfully designed features can transform your relationship with the ancient wisdom of the Bhagavad Gita
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 relative">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 0.1}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
