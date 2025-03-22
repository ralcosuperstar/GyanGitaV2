import { motion } from 'framer-motion';

const ConsciousnessAnimation = () => {
  return (
    <motion.div 
      className="fixed inset-0 w-full h-full"
      style={{ 
        background: 'rgba(255, 0, 0, 0.1)',
        border: '4px solid yellow',
        zIndex: 1 
      }}
    >
      {/* Main Circle */}
      <motion.div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: '200px',
          height: '200px',
          background: 'linear-gradient(45deg, rgba(var(--primary), 0.8), rgba(var(--primary), 0.4))',
          borderRadius: '50%',
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Pulsing Ring */}
      <motion.div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: '300px',
          height: '300px',
          border: '8px solid var(--primary)',
          borderRadius: '50%',
        }}
        animate={{
          scale: [1, 1.5],
          opacity: [0.5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </motion.div>
  );
};

export default ConsciousnessAnimation;