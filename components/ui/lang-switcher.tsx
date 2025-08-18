"use client"

import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n"
import { Languages } from "lucide-react"

export function LangSwitcher() {
  const { locale, setLocale } = useI18n()

  return (
    <Button variant="ghost" size="sm" onClick={() => setLocale(locale === "ar" ? "en" : "ar")} className="gap-2">
      <Languages className="h-4 w-4" />
      {locale === "ar" ? "EN" : "عر"}
    </Button>
  )
}
