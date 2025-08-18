"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SourceBadge } from "@/components/ui/source-badge"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import type { Dalil } from "@/types/content"

interface DalilCardProps {
  dalil: Dalil[]
  className?: string
}

export function DalilCard({ dalil, className = "" }: DalilCardProps) {
  const [expanded, setExpanded] = useState(false)
  const { locale } = useI18n()

  if (!dalil || dalil.length === 0) return null

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {dalil.map((d, index) => (
              <SourceBadge key={index} dalil={d} />
            ))}
          </div>
          <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0">
          <div className="space-y-4">
            {dalil.map((d, index) => (
              <div key={index} className="border-l-2 border-green-500 pl-4">
                <p className="text-sm font-medium text-green-700 dark:text-green-400 mb-1">{d.ref}</p>
                <p className="text-sm leading-relaxed">{locale === "ar" ? d.text_ar : d.text_en || d.text_ar}</p>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
