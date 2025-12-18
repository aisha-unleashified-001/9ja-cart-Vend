import { motion } from "framer-motion";
import { ImageIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ImagePlaceholderProps {
  className?: string;
  aspectRatio?: "square" | "video" | "portrait" | "wide";
  size?: "sm" | "md" | "lg" | "xl";
  showIcon?: boolean;
  animate?: boolean;
  loading?: boolean;
  alt?: string;
  children?: React.ReactNode;
}

const aspectRatioClasses = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
  wide: "aspect-[21/9]",
};

const sizeClasses = {
  sm: "w-16 h-16",
  md: "w-32 h-32",
  lg: "w-48 h-48",
  xl: "w-64 h-64",
};

export const ImagePlaceholder = ({
  className,
  aspectRatio = "video",
  size,
  showIcon = true,
  animate = true,
  loading = false,
  alt = "Image placeholder",
  children,
}: ImagePlaceholderProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const baseClasses = cn(
    "relative overflow-hidden rounded-lg border border-border bg-gradient-to-br from-muted/50 to-muted/80",
    "flex items-center justify-center group cursor-pointer",
    "hover:border-primary/30 transition-all duration-300",
    size ? sizeClasses[size] : aspectRatioClasses[aspectRatio],
    className
  );

  const iconVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: { scale: 1.1, rotate: 5 },
    loading: { rotate: 360 },
  };

  const shimmerVariants = {
    initial: { x: "-100%" },
    animate: { x: "100%" },
  };

  return (
    <motion.div
      className={baseClasses}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={animate ? { opacity: 0, scale: 0.95 } : undefined}
      animate={animate ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      role="img"
      aria-label={alt}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
          }}
        />
      </div>

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,theme(colors.primary)_1px,transparent_1px)] bg-[length:20px_20px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-muted-foreground">
        {loading ? (
          <motion.div
            variants={iconVariants}
            animate="loading"
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-8 h-8" />
          </motion.div>
        ) : showIcon ? (
          <motion.div
            variants={iconVariants}
            initial="initial"
            animate={isHovered ? "hover" : "initial"}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <ImageIcon className="w-8 h-8 mb-2" />
          </motion.div>
        ) : null}

        {children && <div className="text-center">{children}</div>}

        {!children && !loading && (
          <motion.p
            className="text-sm font-medium opacity-60 group-hover:opacity-100 transition-opacity"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.2 }}
          >
            Image Coming Soon
          </motion.p>
        )}
      </div>

      {/* Hover overlay */}
      <motion.div
        className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={false}
        animate={{ opacity: isHovered ? 1 : 0 }}
      />
    </motion.div>
  );
};

export default ImagePlaceholder;
