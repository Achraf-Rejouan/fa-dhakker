"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DalilCard } from "@/components/ui/dalil-card"
import { useI18n } from "@/lib/i18n"
import { getContents } from "@/lib/api"
import { Search } from "lucide-react"
import type { ContentItem } from "@/types/content"

export default function ContentPage() {
  const { t, locale } = useI18n()
  const [contents, setContents] = useState<Record<string, ContentItem[]>>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  const contentTypes = [
    { key: "arkan", label: t("content.arkan") },
    { key: "wajibat", label: t("content.wajibat") },
    { key: "sunan", label: t("content.sunan") },
    { key: "shuroot", label: t("content.shuroot") },
  ]

  useEffect(() => {
    async function loadContents() {
      try {
        const results: Record<string, ContentItem[]> = {}
        for (const type of contentTypes) {
          results[type.key] = await getContents(type.key)
        }
        setContents(results)
      } catch (error) {
        console.error("Failed to load contents:", error)
      } finally {
        setLoading(false)
      }
    }

    loadContents()
  }, [])

  const filterItems = (items: ContentItem[]) => {
    if (!searchTerm) return items
    return items.filter((item) => {
      const title = locale === "ar" ? item.title_ar : item.title_en || item.title_ar
      const description = locale === "ar" ? item.description_ar : item.description_en || item.description_ar
      return (
        title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })
  }

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
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">
          {locale === "ar" ? "محتوى الصلاة" : "Prayer Content"}
        </h1>
        <p className="text-muted-foreground mb-6">
          {locale === "ar" 
            ? "تعرف على أركان وواجبات وسنن وشروط الصلاة"
            : "Learn about the pillars, obligations, recommendations, and conditions of prayer"
          }
        </p>

        {/* Search */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={
              locale === "ar" 
                ? "البحث في المحتوى..."
                : "Search content..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rtl:pl-4 rtl:pr-10"
          />
        </div>
      </div>

      <Tabs defaultValue="arkan" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {contentTypes.map((type) => (
            <TabsTrigger key={type.key} value={type.key}>
              {type.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {contentTypes.map((type) => (
          <TabsContent key={type.key} value={type.key} className="mt-6">
            <div className="grid gap-6">
              {filterItems(contents[type.key] || []).map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <CardTitle>{locale === "ar" ? item.title_ar : item.title_en || item.title_ar}</CardTitle>
                    <CardDescription>
                      {locale === "ar" ? item.description_ar : item.description_en || item.description_ar}
                    </CardDescription>
                  </CardHeader>
                  {item.dalil && item.dalil.length > 0 && (
                    <CardContent>
                      <DalilCard dalil={item.dalil} />
                    </CardContent>
                  )}
                </Card>
              ))}

              {filterItems(contents[type.key] || []).length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">لا توجد نتائج للبحث</p>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
