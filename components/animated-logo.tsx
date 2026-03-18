"use client"

import { motion } from "framer-motion"

export function AnimatedLogo({ size = "large" }: { size?: "small" | "large" }) {
  const isLarge = size === "large"

  return (
    <motion.div
      className={`relative flex items-center justify-center ${isLarge ? "w-56 h-56" : "w-11 h-11"}`}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
    >
      {isLarge && (
        <>
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: "linear-gradient(135deg, oklch(0.65 0.2 25 / 0.2), oklch(0.6 0.18 250 / 0.2))",
            }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-6 rounded-full"
            style={{
              background: "linear-gradient(135deg, oklch(0.6 0.18 250 / 0.2), oklch(0.65 0.2 25 / 0.2))",
            }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.15, 0.4] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.5 }}
          />
        </>
      )}

      <motion.div
        className={`relative z-10 flex items-center justify-center rounded-2xl ${isLarge ? "w-36 h-36" : "w-9 h-9"}`}
        style={{
          background: "linear-gradient(135deg, oklch(0.65 0.2 25), oklch(0.55 0.18 35))",
          boxShadow: isLarge ? "0 20px 50px oklch(0.65 0.2 25 / 0.35)" : "0 4px 12px oklch(0.65 0.2 25 / 0.25)",
        }}
        whileHover={isLarge ? { scale: 1.05, rotate: 5 } : {}}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {/* Ondas de sonido animadas */}
        <svg viewBox="0 0 100 100" className={`${isLarge ? "w-20 h-20" : "w-5 h-5"}`} fill="none">
          {[
            { x: 25, delay: 0, height: [30, 50] },
            { x: 40, delay: 0.1, height: [50, 25] },
            { x: 55, delay: 0.2, height: [35, 55] },
            { x: 70, delay: 0.3, height: [45, 30] },
          ].map((bar, i) => (
            <motion.rect
              key={i}
              x={bar.x}
              y={50 - bar.height[0] / 2}
              width="8"
              rx="4"
              fill="white"
              initial={{ height: bar.height[0] }}
              animate={{
                height: [bar.height[0], bar.height[1], bar.height[0]],
                y: [50 - bar.height[0] / 2, 50 - bar.height[1] / 2, 50 - bar.height[0] / 2],
              }}
              transition={{
                duration: 0.8,
                repeat: Number.POSITIVE_INFINITY,
                delay: bar.delay,
                ease: "easeInOut",
              }}
            />
          ))}
        </svg>
      </motion.div>
    </motion.div>
  )
}
