"use client"

import { motion } from "framer-motion"
import Image from "next/image"

type PoseType = "standing" | "takbir" | "ruku" | "sujud" | "tashahhud" | "salam"

interface PrayerPoseProps {
  pose: PoseType
  className?: string
  animate?: boolean
}

const poseImages: Record<PoseType, string> = {
  standing: "/poses/standing.png",
  takbir: "/poses/takbir.png",
  ruku: "/poses/ruku.png",
  sujud: "/poses/sujud.png",
  tashahhud: "/poses/tashahhud.png",
  salam: "/poses/salam.png",
}

export function PrayerPose({ pose, className = "", animate = true }: PrayerPoseProps) {
  const src = poseImages[pose]

  if (!src) return null

  return (
    <motion.div
      className={`w-full h-full flex items-center justify-center ${className}`}
      initial={animate ? { opacity: 0, scale: 0.9 } : false}
      animate={animate ? { opacity: 1, scale: 1 } : false}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Image
        src={src}
        alt={pose}
        width={400}
        height={400}
        className="object-contain w-full h-full"
        priority
      />
    </motion.div>
  )
}
