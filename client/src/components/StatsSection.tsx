import { motion } from "framer-motion";
import { Heart, Users, BookOpen, Star } from "lucide-react";

const stats = [
  {
    value: "700+",
    label: "Gita Verses",
    icon: BookOpen,
    description: "Complete Sanskrit verses with translations"
  },
  {
    value: "15K+",
    label: "Active Users",
    icon: Users,
    description: "Growing community of seekers"
  },
  {
    value: "50K+",
    label: "Recommendations",
    icon: Heart,
    description: "Personalized verse suggestions"
  },
  {
    value: "4.9",
    label: "User Rating",
    icon: Star,
    description: "Average user satisfaction"
  }
];

const StatCard = ({ stat, index }: { stat: typeof stats[0], index: number }) => {
  const Icon = stat.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/2 to-transparent rounded-2xl blur-xl transform group-hover:scale-110 transition-transform duration-300" />
      <div className="relative backdrop-blur-xl bg-white/[0.03] rounded-xl p-6 border border-white/10 text-center h-full 
                    hover:border-primary/20 transition-all duration-300 flex flex-col items-center justify-center">
        <div className="rounded-2xl bg-primary/10 p-4 mb-6 group-hover:bg-primary/20 transition-colors">
          <Icon className="w-8 h-8 text-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="text-4xl font-light text-white/90">{stat.value}</h3>
          <p className="text-lg font-medium text-primary">{stat.label}</p>
          <p className="text-sm text-white/60">{stat.description}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default function StatsSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-30" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
