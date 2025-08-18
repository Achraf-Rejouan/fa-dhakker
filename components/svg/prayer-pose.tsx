"use client"

import { motion } from "framer-motion"

type PoseType = "standing" | "takbir" | "ruku" | "sujud" | "tashahhud" | "salam"

interface PrayerPoseProps {
  pose: PoseType
  className?: string
  animate?: boolean
}

const poses = {
  standing: {
    bodyPath: "M45 20 L55 20 L55 65 L45 65 Z",
    head: { cx: 50, cy: 15, r: 6 },
    leftArm: "M45 25 L40 30 L38 45 L40 60",
    rightArm: "M55 25 L60 30 L62 45 L60 60",
    leftLeg: "M47 65 L45 85 L43 95",
    rightLeg: "M53 65 L55 85 L57 95",
    hands: [
      { cx: 40, cy: 60, r: 2.5 },
      { cx: 60, cy: 60, r: 2.5 },
    ],
    feet: [
      { cx: 43, cy: 95, rx: 4, ry: 2 },
      { cx: 57, cy: 95, rx: 4, ry: 2 },
    ],
  },
  takbir: {
    bodyPath: "M45 20 L55 20 L55 65 L45 65 Z",
    head: { cx: 50, cy: 15, r: 6 },
    leftArm: "M45 25 L35 15 L30 10",
    rightArm: "M55 25 L65 15 L70 10",
    leftLeg: "M47 65 L45 85 L43 95",
    rightLeg: "M53 65 L55 85 L57 95",
    hands: [
      { cx: 30, cy: 10, r: 2.5 },
      { cx: 70, cy: 10, r: 2.5 },
    ],
    feet: [
      { cx: 43, cy: 95, rx: 4, ry: 2 },
      { cx: 57, cy: 95, rx: 4, ry: 2 },
    ],
  },
  ruku: {
    bodyPath: "M45 20 L55 20 L55 45 L52 50 L48 50 L45 45 Z",
    head: { cx: 50, cy: 15, r: 6 },
    leftArm: "M45 25 L35 40 L30 50",
    rightArm: "M55 25 L65 40 L70 50",
    leftLeg: "M48 50 L46 70 L44 80",
    rightLeg: "M52 50 L54 70 L56 80",
    hands: [
      { cx: 30, cy: 50, r: 2.5 },
      { cx: 70, cy: 50, r: 2.5 },
    ],
    feet: [
      { cx: 44, cy: 80, rx: 4, ry: 2 },
      { cx: 56, cy: 80, rx: 4, ry: 2 },
    ],
  },
  sujud: {
    bodyPath: "M40 55 L60 55 L58 65 L42 65 Z",
    head: { cx: 50, cy: 65, r: 6 },
    leftArm: "M42 55 L25 60 L20 65",
    rightArm: "M58 55 L75 60 L80 65",
    leftLeg: "M42 65 L35 75 L30 85",
    rightLeg: "M58 65 L65 75 L70 85",
    hands: [
      { cx: 20, cy: 65, r: 2.5 },
      { cx: 80, cy: 65, r: 2.5 },
    ],
    feet: [
      { cx: 30, cy: 85, rx: 4, ry: 2 },
      { cx: 70, cy: 85, rx: 4, ry: 2 },
    ],
    forehead: { cx: 50, cy: 70, rx: 3, ry: 1.5 },
  },
  tashahhud: {
    bodyPath: "M45 35 L55 35 L55 55 L45 55 Z",
    head: { cx: 50, cy: 30, r: 6 },
    leftArm: "M45 40 L38 45 L35 55",
    rightArm: "M55 40 L62 45 L65 52",
    leftLeg: "M45 55 L30 70 L25 80",
    rightLeg: "M55 55 L60 65 L65 70",
    hands: [
      { cx: 35, cy: 55, r: 2.5 },
      { cx: 65, cy: 52, r: 2.5 },
    ],
    feet: [
      { cx: 25, cy: 80, rx: 4, ry: 2 },
      { cx: 65, cy: 70, rx: 4, ry: 2 },
    ],
    finger: "M65 52 L68 48",
  },
  salam: {
    bodyPath: "M45 20 L55 20 L55 65 L45 65 Z",
    head: { cx: 48, cy: 15, r: 6 },
    leftArm: "M45 25 L40 35 L38 50",
    rightArm: "M55 25 L65 30 L70 35",
    leftLeg: "M47 65 L45 85 L43 95",
    rightLeg: "M53 65 L55 85 L57 95",
    hands: [
      { cx: 38, cy: 50, r: 2.5 },
      { cx: 70, cy: 35, r: 2.5 },
    ],
    feet: [
      { cx: 43, cy: 95, rx: 4, ry: 2 },
      { cx: 57, cy: 95, rx: 4, ry: 2 },
    ],
  },
}

export function PrayerPose({ pose, className = "", animate = true }: PrayerPoseProps) {
  const currentPose = poses[pose]

  const pathVariants = {
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1 },
  }

  const fillVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
  }

  return (
    <svg
      viewBox="0 0 100 100"
      className={`w-full h-full ${className}`}
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.path
        d={currentPose.bodyPath}
        variants={animate ? fillVariants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        transition={{ duration: 0.6, delay: 0.2 }}
        fill="currentColor"
        stroke="none"
      />

      <motion.circle
        cx={currentPose.head.cx}
        cy={currentPose.head.cy}
        r={currentPose.head.r}
        variants={animate ? fillVariants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        transition={{ duration: 0.6, delay: 0.1 }}
        fill="currentColor"
        stroke="none"
      />

      <motion.path
        d={currentPose.leftArm}
        variants={animate ? pathVariants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        transition={{ duration: 0.6, delay: 0.3 }}
        strokeWidth="4"
        fill="none"
      />
      <motion.path
        d={currentPose.rightArm}
        variants={animate ? pathVariants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        transition={{ duration: 0.6, delay: 0.3 }}
        strokeWidth="4"
        fill="none"
      />

      <motion.path
        d={currentPose.leftLeg}
        variants={animate ? pathVariants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        transition={{ duration: 0.6, delay: 0.4 }}
        strokeWidth="5"
        fill="none"
      />
      <motion.path
        d={currentPose.rightLeg}
        variants={animate ? pathVariants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        transition={{ duration: 0.6, delay: 0.4 }}
        strokeWidth="5"
        fill="none"
      />

      {/* Hands */}
      {currentPose.hands?.map((hand, index) => (
        <motion.circle
          key={`hand-${index}`}
          cx={hand.cx}
          cy={hand.cy}
          r={hand.r}
          variants={animate ? fillVariants : undefined}
          initial={animate ? "initial" : undefined}
          animate={animate ? "animate" : undefined}
          transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
          fill="currentColor"
          stroke="none"
        />
      ))}

      {/* Feet */}
      {currentPose.feet?.map((foot, index) => (
        <motion.ellipse
          key={`foot-${index}`}
          cx={foot.cx}
          cy={foot.cy}
          rx={foot.rx}
          ry={foot.ry}
          variants={animate ? fillVariants : undefined}
          initial={animate ? "initial" : undefined}
          animate={animate ? "animate" : undefined}
          transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
          fill="currentColor"
          stroke="none"
        />
      ))}

      {/* Special elements for specific poses */}
      {currentPose.forehead && (
        <motion.ellipse
          cx={currentPose.forehead.cx}
          cy={currentPose.forehead.cy}
          rx={currentPose.forehead.rx}
          ry={currentPose.forehead.ry}
          variants={animate ? fillVariants : undefined}
          initial={animate ? "initial" : undefined}
          animate={animate ? "animate" : undefined}
          transition={{ duration: 0.4, delay: 0.7 }}
          fill="currentColor"
          stroke="none"
          opacity="0.8"
        />
      )}

      {/* Pointing finger for tashahhud */}
      {currentPose.finger && (
        <motion.path
          d={currentPose.finger}
          variants={animate ? pathVariants : undefined}
          initial={animate ? "initial" : undefined}
          animate={animate ? "animate" : undefined}
          transition={{ duration: 0.4, delay: 0.8 }}
          strokeWidth="3"
          fill="none"
        />
      )}
    </svg>
  )
}
