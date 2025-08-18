"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useI18n } from "@/lib/i18n"
import { getFaq } from "@/lib/api"
import { Search } from "lucide-react"
import type { FaqItem } from "@/types/content"

export default function FaqPage() {
  const { t, locale } = useI18n()
  const [faqItems, setFaqItems] = useState<FaqItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFaq() {
      try {
        const data = await getFaq()
        setFaqItems(data)
      } catch (error) {
        console.error("Failed to load FAQ:", error)
      } finally {
        setLoading(false)
      }
    }

    loadFaq()
  }, [])

  const filteredItems = faqItems.filter((item) => {
    if (!searchTerm) return true
    const question = locale === "ar" ? item.question_ar : item.question_en || item.question_ar
    const answer = locale === "ar" ? item.answer_ar : item.answer_en || item.answer_ar
    return (
      question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">{t("loading")}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">الأسئلة الشائعة</h1>
        <p className="text-muted-foreground mb-6">إجابات على أكثر الأسئلة شيوعاً حول الصلاة</p>

        {/* Search */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={t("faq.search")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rtl:pl-4 rtl:pr-10"
          />
        </div>
      </div>

      {filteredItems.length > 0 ? (
        <Accordion type="single" collapsible className="w-full">
          {filteredItems.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="text-right rtl:text-right text-base font-medium">
                {locale === "ar" ? item.question_ar : item.question_en || item.question_ar}
              </AccordionTrigger>
              <AccordionContent className="text-right rtl:text-right text-muted-foreground leading-relaxed">
                {locale === "ar" ? item.answer_ar : item.answer_en || item.answer_ar}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">لا توجد نتائج للبحث</p>
        </div>
      )}
    </div>
  )
}
