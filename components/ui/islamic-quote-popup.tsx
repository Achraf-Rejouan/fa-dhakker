"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const islamicQuotes = [
  {
    text_ar: "وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَارْكَعُوا مَعَ الرَّاكِعِينَ",
    text_en: "And establish prayer and give zakah and bow with those who bow",
    source: "البقرة: 43",
    type: "quran",
  },
  {
    text_ar: "إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ",
    text_en: "Indeed, prayer prohibits immorality and wrongdoing",
    source: "العنكبوت: 45",
    type: "quran",
  },
  {
    text_ar: "الصلاة عماد الدين، من أقامها أقام الدين، ومن هدمها هدم الدين",
    text_en:
      "Prayer is the pillar of religion. Whoever establishes it has established religion, and whoever destroys it has destroyed religion",
    source: "الطبراني",
    type: "hadith",
  },
  {
    text_ar: "أول ما يحاسب عليه العبد يوم القيامة الصلاة",
    text_en: "The first thing a servant will be held accountable for on the Day of Judgment is prayer",
    source: "الترمذي",
    type: "hadith",
  },
  {
    text_ar: "حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَىٰ وَقُومُوا لِلَّهِ قَانِتِينَ",
    text_en: "Maintain with care the prayers and the middle prayer and stand before Allah, devoutly obedient",
    source: "البقرة: 238",
    type: "quran",
  },
]

export function IslamicQuotePopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentQuote, setCurrentQuote] = useState(islamicQuotes[0])

  useEffect(() => {
    // Show popup on first visit or refresh
    const hasSeenPopup = sessionStorage.getItem("hasSeenIslamicQuote")
    if (!hasSeenPopup) {
      const randomQuote = islamicQuotes[Math.floor(Math.random() * islamicQuotes.length)]
      setCurrentQuote(randomQuote)
      setIsOpen(true)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    sessionStorage.setItem("hasSeenIslamicQuote", "true")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full mx-auto bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
        <CardContent className="p-6 text-center relative">
          <Button variant="ghost" size="sm" onClick={handleClose} className="absolute top-2 right-2 h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>

          <div className="mb-4">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white text-xl">📿</span>
            </div>
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
              {currentQuote.type === "quran" ? "آية كريمة" : "حديث شريف"}
            </h3>
          </div>

          <div className="space-y-4">
            <p className="text-right text-lg leading-relaxed text-green-900 dark:text-green-100 font-arabic">
              {currentQuote.text_ar}
            </p>
            <p className="text-sm text-green-700 dark:text-green-300 italic">{currentQuote.text_en}</p>
            <p className="text-xs text-green-600 dark:text-green-400 font-medium">{currentQuote.source}</p>
          </div>

          <Button onClick={handleClose} className="mt-6 bg-green-600 hover:bg-green-700 text-white">
            بارك الله فيك
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
