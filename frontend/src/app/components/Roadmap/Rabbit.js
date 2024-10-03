// Rabbit.js
import { motion } from "framer-motion";

export default function Rabbit({
  svgSize,
  position,
  previousDirection,
  imageSource,
  onAnimationStart,
  onAnimationComplete,
}) {
  return (
    <motion.img
      src={imageSource}
      width={svgSize}
      height={svgSize}
      className="absolute z-10"
      style={{
        transform: previousDirection === "right" ? "scaleX(1)" : "scaleX(-1)",
      }}
      animate={{
        left: `${position.left + 80}px`,
        top: `${position.top}px`,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 200,
      }}
      onAnimationStart={onAnimationStart}
      onAnimationComplete={onAnimationComplete}
    />
  );
}
