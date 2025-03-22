import { motion } from 'framer-motion';
import { useEffect } from 'react';

const ConsciousnessAnimation = () => {
  useEffect(() => {
    console.log('ConsciousnessAnimation mounted');
  }, []);

  // Generate random points for neural network
  const generatePoints = (count: number) => {
    return Array.from({ length: count }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      radius: Math.random() * 2 + 1,
    }));
  };

  const points = generatePoints(30);

  return (
    <div 
      className="absolute inset-0 w-full h-full min-h-[600px] flex items-center justify-center"
      style={{ 
        backgroundColor: 'rgba(255, 0, 0, 0.1)',  // Debug background
        border: '2px solid yellow' // Debug border
      }}
    >
      {/* Neural network points */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <radialGradient id="point-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </radialGradient>
        </defs>
        {points.map((point, i) => (
          <motion.circle
            key={i}
            cx={`${point.x}%`}
            cy={`${point.y}%`}
            r={point.radius * 2}
            fill="url(#point-gradient)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </svg>

      {/* Animated globe in the center */}
      <div className="relative w-40 h-40">
        <motion.div
          className="w-full h-full rounded-full bg-gradient-to-r from-primary/60 to-primary/40"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* Grid lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.path
                key={i}
                d={`M 0,${i * 14 + 2} L 100,${i * 14 + 2}`}
                stroke="var(--primary)"
                strokeWidth="1"
                strokeOpacity="0.5"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            ))}
          </svg>
        </motion.div>
      </div>

      {/* Oval frame */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[150%] border-4 border-primary/40 rounded-[100%]"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Neural connection rays */}
      <svg className="absolute inset-0 w-full h-full">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.line
            key={i}
            x1={`${Math.random() * 100}%`}
            y1={`${Math.random() * 100}%`}
            x2={`${Math.random() * 100}%`}
            y2={`${Math.random() * 100}%`}
            stroke="var(--primary)"
            strokeWidth="3"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </svg>
    </div>
  );
};

export default ConsciousnessAnimation;