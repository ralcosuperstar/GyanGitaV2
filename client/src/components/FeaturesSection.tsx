import { useRef } from "react";
import { motion } from "framer-motion";
import { 
  Brain, 
  Heart, 
  Sparkles,
  Moon,
  Sun,
  Sprout,
  Flower2
} from "lucide-react";

const features = [
  {
    icon: Flower2,
    title: "Inner Peace",
    description: "Find tranquility in ancient wisdom"
  },
  {
    icon: Brain,
    title: "Emotional Guidance",
    description: "Navigate your feelings with divine insight"
  },
  {
    icon: Moon,
    title: "Daily Reflection",
    description: "Grow spiritually with daily verses"
  },
  {
    icon: Sprout,
    title: "Personal Growth",
    description: "Transform through timeless teachings"
  },
  {
    icon: Sun,
    title: "Modern Context",
    description: "Ancient wisdom for today's challenges"
  },
  {
    icon: Heart,
    title: "Healing Journey",
    description: "Find comfort in sacred knowledge"
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
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/2 to-transparent rounded-2xl blur-xl transform group-hover:scale-110 transition-transform duration-300" />
    <div className="relative bg-white/[0.03] backdrop-blur-xl rounded-xl p-6 border border-white/10 text-center h-full flex flex-col items-center justify-center hover:border-primary/20 transition-all duration-300">
      <div className="rounded-2xl bg-primary/10 p-4 mb-6 group-hover:bg-primary/20 transition-colors">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <h3 className="font-medium text-xl mb-3 text-white/90 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-base text-white/60">
        {description}
      </p>
      {/* Sacred Geometry Accent */}
      <div className="absolute -z-10 inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500">
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0%,var(--primary)_25%,transparent_50%)]" />
      </div>
    </div>
  </motion.div>
);

export default function FeaturesSection() {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-30" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-6 py-2 border border-primary/20 rounded-full text-base font-medium text-primary/80 bg-primary/5 mb-6"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Sacred Wisdom for Modern Life
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl font-light mb-6"
          >
            Discover the Power of
            <span className="block mt-2 font-normal bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              Ancient Wisdom
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg text-white/60"
          >
            Experience the transformative power of the Bhagavad Gita's timeless teachings,
            perfectly adapted for your modern spiritual journey
          </motion.p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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