import { motion } from 'framer-motion';

const ConsciousnessAnimation = () => {
  return (
    <motion.div 
      className="absolute inset-0 w-full h-full min-h-[90vh]"
      style={{ backgroundColor: 'rgba(255, 0, 0, 0.1)' }} // Debug background
    >
      {/* Center Circle */}
      <motion.div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                   w-40 h-40 rounded-full bg-primary/30"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Simple Pulse Ring */}
      <motion.div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                   w-60 h-60 rounded-full border-2 border-primary/20"
        animate={{
          scale: [1, 1.5],
          opacity: [0.5, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut"
        }}
      />
    </motion.div>
  );
};

export default ConsciousnessAnimation;