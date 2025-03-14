import { WisdomCard } from "./WisdomCard";
import { motion } from "framer-motion";

const wisdomCards = [
  {
    quote: "Your anxiety about the future is useless. Focus on what you can control in this moment.",
    source: "Krishna's wisdom for modern anxiety",
    chapter: 2,
    verse: 47,
    layout: "gradient"
  },
  {
    quote: "Social media likes won't fill the void within. True peace comes from understanding your inner self.",
    source: "Ancient wisdom for digital age",
    chapter: 6,
    verse: 35,
    layout: "minimal"
  },
  {
    quote: "Stop comparing your chapter 1 to someone else's chapter 20. Your journey is uniquely yours.",
    source: "Guidance for self-doubt",
    chapter: 2,
    verse: 22,
    layout: "centered"
  }
] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25
    }
  }
};

export function WisdomCardGrid() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {wisdomCards.map((card, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex"
            >
              <WisdomCard {...card} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
