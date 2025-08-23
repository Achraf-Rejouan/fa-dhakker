"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Locale = "ar" | "en"

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
  dir: "ltr" | "rtl"
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

const messages = {
  ar: {
    "nav.home": "الرئيسية",
    "nav.learn": "تعلم",
    "nav.content": "المحتوى",
    "nav.faq": "الأسئلة الشائعة",
    "nav.chat": "المساعد",
    "nav.about": "حول",
    "hero.title": "فَذَكِّر: تعلّم الصلاة خطوة بخطوة",
    "hero.subtitle": "شرح مبسّط مع أدلته من القرآن والسنّة",
    "hero.cta": "ابدأ الآن",
    "hero.disclaimer": "المحتوى للتعليم العام، وللفتوى يُرجى الرجوع لأهل العلم الثقات.",
    "prayers.fajr": "الفجر",
    "prayers.dhuhr": "الظهر",
    "prayers.asr": "العصر",
    "prayers.maghrib": "المغرب",
    "prayers.isha": "العشاء",
    "content.arkan": "الأركان",
    "content.wajibat": "الواجبات",
    "content.sunan": "السنن",
    "content.shuroot": "الشروط",
    "chat.disclaimer": "الإجابات تعليمية وليست فتوى. يُرجى الرجوع لأهل العلم.",
    "chat.send": "إرسال",
    "faq.search": "البحث في الأسئلة...",
    "step.next": "التالي",
    "step.prev": "السابق",
    "step.play": "تشغيل",
    "step.pause": "إيقاف",
    "dalil.quran": "قرآن",
    "dalil.hadith": "حديث",
    loading: "جاري التحميل...",
    error: "حدث خطأ",
    "chat.title": "المساعد الذكي للصلاة",
      "chat.subtitle": "اسأل أي سؤال حول الصلاة واحصل على إجابة فورية ودقيقة من الذكاء الاصطناعي المتخصص",
      "chat.conversation": "المحادثة",
      "chat.messages": "رسالة",
      "chat.clear": "مسح المحادثة",
      "chat.greeting": "ٱلسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ ٱللهِ وَبَرَكَاتُهُ 👋",
      "chat.welcome": "كيف يمكنني مساعدتك في تعلم الصلاة اليوم؟",
      "chat.placeholder": "اكتب سؤالك هنا... (مثل: كيف أتوضأ؟ أو ما هي أركان الصلاة؟)",
      "chat.typing": "جاري الكتابة...",
      "chat.copy": "نسخ الإجابة",
      "chat.source": "المصدر",
      "chat.error": "حدث خطأ:",
      "chat.retry": "إعادة المحاولة",
      "chat.remaining": "متبقي",
      "chat.characters": "حرف",
      "chat.quickActions": "إجراءات سريعة:",
      "chat.wudu": "الوضوء",
      "chat.pillars": "أركان الصلاة",
      "chat.times": "أوقات الصلاة",
      "footer.blessing": "🤲 نسأل الله أن ينفعنا وإياكم بما تعلمنا",
      "footer.disclaimer": "💡 هذا المساعد يقدم معلومات عامة. يُرجى مراجعة العلماء المختصين للفتاوى الخاصة"
    },
  en: {
    "nav.home": "Home",
    "nav.learn": "Learn",
    "nav.content": "Content",
    "nav.faq": "FAQ",
    "nav.chat": "Assistant",
    "nav.about": "About",
    "hero.title": "Fa-dhakker: Learn Prayer Step by Step",
    "hero.subtitle": "Simple explanation with evidence from Quran and Sunnah",
    "hero.cta": "Start Now",
    "hero.disclaimer": "Content is for general education. For religious rulings, please consult qualified scholars.",
    "prayers.fajr": "Fajr",
    "prayers.dhuhr": "Dhuhr",
    "prayers.asr": "Asr",
    "prayers.maghrib": "Maghrib",
    "prayers.isha": "Isha",
    "content.arkan": "Pillars",
    "content.wajibat": "Obligations",
    "content.sunan": "Recommended",
    "content.shuroot": "Conditions",
    "chat.disclaimer": "Answers are educational and not religious rulings. Please consult scholars.",
    "chat.send": "Send",
    "faq.search": "Search questions...",
    "step.next": "Next",
    "step.prev": "Previous",
    "step.play": "Play",
    "step.pause": "Pause",
    "dalil.quran": "Quran",
    "dalil.hadith": "Hadith",
    loading: "Loading...",
    error: "Error occurred",
     "chat.title": "Smart Prayer Assistant",
  "chat.subtitle": "Ask any question about prayer and get instant, accurate answers from specialized AI",
  "chat.conversation": "Conversation",
  "chat.messages": "messages",
  "chat.clear": "Clear Chat",
  "chat.greeting": "Peace be upon you 👋",
  "chat.welcome": "How can I help you learn about prayer today?",
  "chat.placeholder": "Type your question here... (e.g.: How to perform ablution? or What are the pillars of prayer?)",
  "chat.typing": "Typing...",
  "chat.copy": "Copy Answer",
  "chat.source": "Source",
  "chat.error": "An error occurred:",
  "chat.retry": "Retry",
  "chat.remaining": "remaining",
  "chat.characters": "characters",
  "chat.quickActions": "Quick Actions:",
  "chat.wudu": "Ablution",
  "chat.pillars": "Pillars of Prayer",
  "chat.times": "Prayer Times",
  "footer.blessing": "🤲 May Allah benefit us with what we learn",
  "footer.disclaimer": "💡 This assistant provides general information. Please consult qualified scholars for specific religious rulings"
  },
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("ar")

  useEffect(() => {
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = locale
  }, [locale])

  const t = (key: string): string => {
    return messages[locale][key as keyof (typeof messages)[typeof locale]] || key
  }

  return (
    <I18nContext.Provider
      value={{
        locale,
        setLocale,
        t,
        dir: locale === "ar" ? "rtl" : "ltr",
      }}
    >
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider")
  }
  return context
}
