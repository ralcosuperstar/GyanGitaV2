import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const ConsciousnessAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);

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
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent" />

      {/* Neural network points */}
      <svg className="absolute inset-0 w-full h-full opacity-50">
        <defs>
          <radialGradient id="point-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </radialGradient>
        </defs>
        {points.map((point, i) => (
          <motion.circle
            key={i}
            cx={`${point.x}%`}
            cy={`${point.y}%`}
            r={point.radius}
            fill="url(#point-gradient)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>

      {/* Animated globe in the center */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="w-32 h-32 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 backdrop-blur-xl"
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
                strokeWidth="0.5"
                strokeOpacity="0.2"
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
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[150%] border border-primary/10 rounded-[100%] backdrop-blur-sm"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Neural connection rays */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="ray-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.line
            key={i}
            x1={`${Math.random() * 100}%`}
            y1={`${Math.random() * 100}%`}
            x2={`${Math.random() * 100}%`}
            y2={`${Math.random() * 100}%`}
            stroke="url(#ray-gradient)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>
    </div>
  );
};

export default ConsciousnessAnimation;
