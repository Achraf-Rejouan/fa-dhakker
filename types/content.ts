export type Dalil = {
  kind: "quran" | "hadith"
  ref: string // e.g., "البقرة:43" or "البخاري 757"
  text_ar: string
  text_en?: string
}

export type Step = {
  id: string
  prayer: "fajr" | "dhuhr" | "asr" | "maghrib" | "isha"
  order: number
  title_ar: string
  title_en?: string
  description_ar: string
  description_en?: string
  tags?: string[]
  svgId: "standing" | "takbir" | "ruku" | "sujud" | "tashahhud" | "salam"
  dalil?: Dalil[]
}

export type ContentItem = {
  id: string
  type: "arkan" | "wajibat" | "sunan" | "shuroot"
  title_ar: string
  title_en?: string
  description_ar: string
  description_en?: string
  dalil?: Dalil[]
}

export type FaqItem = {
  id: string
  question_ar: string
  question_en?: string
  answer_ar: string
  answer_en?: string
  tags?: string[]
}

export type ChatMessage = {
  id: string
  type: "user" | "bot"
  content: string
  source?: string
  timestamp: Date
}

export type Prayer = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha"

export type Locale = "ar" | "en"
