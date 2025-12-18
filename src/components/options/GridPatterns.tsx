import { motion } from "framer-motion";

const GridPattern = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Animated grid */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-primary/40"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Glowing intersection points */}
      {Array.from({ length: 12 }).map((_, index) => (
        <motion.div
          key={index}
          className="absolute w-2 h-2 bg-primary/60 rounded-full"
          style={{
            left: `${(index % 4) * 30 + 10}%`,
            top: `${Math.floor(index / 4) * 35 + 15}%`,
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 2,
            delay: index * 0.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default GridPattern;
