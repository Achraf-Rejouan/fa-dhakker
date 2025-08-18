"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface ArabicLogoAnimationProps {
  onComplete?: () => void
  className?: string
}

export function ArabicLogoAnimation({ onComplete, className = "" }: ArabicLogoAnimationProps) {
  const [displayText, setDisplayText] = useState("")
  const [showCursor, setShowCursor] = useState(true)
  const [isComplete, setIsComplete] = useState(false)

  const fullText = "فَذَكِّر"

  const getTypingDelay = (index: number) => {
    const baseSpeeds = [200, 150, 180, 160, 140, 170] // Variable speeds per character
    const randomVariation = Math.random() * 50 - 25 // ±25ms random variation
    return (baseSpeeds[index] || 160) + randomVariation
  }

  useEffect(() => {
    let currentIndex = 0
    let timeoutId: NodeJS.Timeout

    const typeNextCharacter = () => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex))
        currentIndex++

        if (currentIndex <= fullText.length) {
          // Add occasional longer pauses (like thinking)
          const shouldPause = Math.random() < 0.2 && currentIndex > 1
          const delay = shouldPause ? getTypingDelay(currentIndex) + 200 : getTypingDelay(currentIndex)

          timeoutId = setTimeout(typeNextCharacter, delay)
        } else {
          setIsComplete(true)
          setTimeout(() => {
            setShowCursor(false)
            onComplete?.()
          }, 500)
        }
      }
    }

    timeoutId = setTimeout(typeNextCharacter, 300) // Initial delay

    return () => clearTimeout(timeoutId)
  }, [fullText, onComplete])

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative">
        <motion.h1
          className="text-6xl md:text-8xl font-bold text-black dark:text-white font-arabic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            fontFamily: "var(--font-cairo), serif",
            direction: "rtl",
            textAlign: "center",
            letterSpacing: "0.05em",
          }}
        >
          {displayText}
          <motion.span
            className="inline-block w-1 h-16 md:h-20 bg-black dark:bg-white ml-1"
            animate={{
              opacity: showCursor ? [1, 0, 1] : 0,
            }}
            transition={{
              duration: showCursor ? 0.8 : 0.5, // Slightly slower blink for more natural feel
              repeat: showCursor && !isComplete ? Number.POSITIVE_INFINITY : 0,
              ease: "easeInOut",
            }}
          />
        </motion.h1>
      </div>
    </div>
  )
}
