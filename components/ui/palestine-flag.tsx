"use client"

import { motion } from "framer-motion"

export function PalestineFlag() {
  return (
    <motion.div
      className="relative w-8 h-6 overflow-hidden rounded-sm shadow-sm"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      {/* Flag stripes */}
      <div className="w-full h-2 bg-black"></div>
      <div className="w-full h-2 bg-white"></div>
      <div className="w-full h-2 bg-green-600"></div>

      {/* Red triangle */}
      <div
        className="absolute left-0 top-0 w-0 h-0"
        style={{
          borderTop: "12px solid transparent",
          borderBottom: "12px solid transparent",
          borderLeft: "16px solid #dc2626",
        }}
      ></div>

      {/* Gentle wave animation */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{
          x: [-100, 100],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  )
}
