import { motion } from "framer-motion";
import { BookOpen, Sparkles, Brain, Heart } from "lucide-react";

const usps = [
  {
    icon: Brain,
    title: "Emotional Intelligence",
    description: "Find verses that match your emotional state through our innovative mood-based guidance system"
  },
  {
    icon: BookOpen,
    title: "Ancient Wisdom",
    description: "Access timeless knowledge from all 700 verses across 18 chapters of the Bhagavad Gita"
  },
  {
    icon: Heart,
    title: "Personal Growth",
    description: "Transform daily challenges into opportunities for spiritual growth with practical wisdom"
  },
  {
    icon: Sparkles,
    title: "Modern Accessibility",
    description: "Experience sacred teachings through a beautiful, easy-to-understand modern interface"
  }
];

export default function USPSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-30" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-6 py-2 border border-primary/20 rounded-full text-base font-medium text-primary/80 bg-primary/5 mb-6"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Why Choose GyanGita
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl font-light mb-6"
          >
            Experience Timeless Wisdom 
            <span className="block mt-2 font-normal bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              in a Modern Way
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg text-white/60"
          >
            Discover how GyanGita makes ancient Bhagavad Gita teachings accessible and relevant for your personal journey
          </motion.p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {usps.map((usp, index) => {
            const Icon = usp.icon;
            return (
              <motion.div
                key={usp.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/2 to-transparent rounded-2xl blur-xl transform group-hover:scale-110 transition-transform duration-300" />
                <div className="relative backdrop-blur-xl bg-white/[0.03] rounded-xl p-8 border border-white/10 text-center 
                             hover:border-primary/20 transition-all duration-300 h-full flex flex-col items-center justify-center">
                  <div className="rounded-2xl bg-primary/10 p-4 mb-6 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-3 text-white/90 group-hover:text-primary transition-colors">
                    {usp.title}
                  </h3>
                  <p className="text-base text-white/60">
                    {usp.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}