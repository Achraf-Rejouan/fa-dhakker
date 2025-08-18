import { Badge } from "@/components/ui/badge"
import { Book, BookOpen } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import type { Dalil } from "@/types/content"

interface SourceBadgeProps {
  dalil: Dalil
}

export function SourceBadge({ dalil }: SourceBadgeProps) {
  const { t } = useI18n()

  return (
    <Badge variant="secondary" className="gap-1">
      {dalil.kind === "quran" ? <BookOpen className="h-3 w-3" /> : <Book className="h-3 w-3" />}
      {t(`dalil.${dalil.kind}`)} - {dalil.ref}
    </Badge>
  )
}
