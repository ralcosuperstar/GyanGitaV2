import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  Brain, 
  Heart, 
  Compass, 
  Globe,
  Sparkles,
  BookOpen,
  Lightbulb
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Brain,
    title: "Smart Recommendations",
    description: "Get verses that match your emotional state"
  },
  {
    icon: Heart,
    title: "Personal Growth",
    description: "Transform your perspective with ancient wisdom"
  },
  {
    icon: Compass,
    title: "Daily Guidance",
    description: "Navigate life with timeless principles"
  },
  {
    icon: Globe,
    title: "Multiple Languages",
    description: "Read in your preferred language"
  }
];

const FeatureCard = ({ icon: Icon, title, description, index }: { 
  icon: any, 
  title: string, 
  description: string,
  index: number
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    whileHover={{ y: -5 }}
    className="relative group"
  >
    <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-xl transform group-hover:scale-110 transition-transform duration-300" />
    <div className="relative bg-card/5 backdrop-blur-sm rounded-xl p-6 border border-primary/10 text-center h-full flex flex-col items-center justify-center hover:border-primary/20 transition-all duration-300">
      <div className="rounded-xl bg-primary/10 p-3 mb-4 group-hover:bg-primary/20 transition-colors">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="font-medium text-lg mb-2 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </motion.div>
);

export default function FeaturesSection() {
  return (
    <section className="py-16 sm:py-20 relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/5 to-background" />

      <div className="container mx-auto px-4 sm:px-6 relative">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-4 py-1.5 border border-primary/20 rounded-full text-sm font-medium text-primary/80 bg-primary/5 mb-4"
          >
            Modern Interface, Timeless Wisdom
          </motion.div>

          <h2 className="text-3xl font-playfair font-semibold mb-4">
            Why Choose <span className="text-primary">GyanGita</span>
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}