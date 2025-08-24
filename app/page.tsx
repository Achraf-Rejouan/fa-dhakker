"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, BookOpen, MessageCircle } from "lucide-react"
import { ArabicLogoAnimation } from "@/components/ui/arabic-logo-animation"
import { useState } from "react"
import { useI18n } from "@/lib/i18n"

export default function HomePage() {
  const { t, locale } = useI18n()
  const [showAnimation, setShowAnimation] = useState(true)

  const prayers = [
    { 
      name: locale === "ar" ? "الفجر" : "Fajr", 
      nameEn: "Fajr", 
      time: locale === "ar" ? "قبل الشروق" : "Before sunrise", 
      href: "/learn/fajr" 
    },
    { 
      name: locale === "ar" ? "الظهر" : "Dhuhr", 
      nameEn: "Dhuhr", 
      time: locale === "ar" ? "بعد الزوال" : "After midday", 
      href: "/learn/dhuhr" 
    },
    { 
      name: locale === "ar" ? "العصر" : "Asr", 
      nameEn: "Asr", 
      time: locale === "ar" ? "بعد الظهر" : "Afternoon", 
      href: "/learn/asr" 
    },
    { 
      name: locale === "ar" ? "المغرب" : "Maghrib", 
      nameEn: "Maghrib", 
      time: locale === "ar" ? "عند الغروب" : "At sunset", 
      href: "/learn/maghrib" 
    },
    { 
      name: locale === "ar" ? "العشاء" : "Isha", 
      nameEn: "Isha", 
      time: locale === "ar" ? "بعد المغرب" : "After Maghrib", 
      href: "/learn/isha" 
    },
  ]

  const features = [
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: locale === "ar" ? "أدلة شرعية" : "Islamic Evidence",
      description: locale === "ar" 
        ? "كل خطوة مدعومة بآيات قرآنية وأحاديث صحيحة"
        : "Every step supported by Quranic verses and authentic hadiths",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: locale === "ar" ? "تعلم تدريجي" : "Gradual Learning",
      description: locale === "ar"
        ? "خطوات مبسطة مع رسوم توضيحية متحركة"
        : "Simplified steps with animated illustrations",
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: locale === "ar" ? "مساعد ذكي" : "Smart Assistant",
      description: locale === "ar"
        ? "اسأل أي سؤال واحصل على إجابة فورية"
        : "Ask any question and get instant answers",
    },
  ]

  const handleAnimationComplete = () => {
    setTimeout(() => {
      setShowAnimation(false)
    }, 1000)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {showAnimation && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 flex items-center justify-center">
          <ArabicLogoAnimation onComplete={handleAnimationComplete} />
        </div>
      )}

      {/* Hero Section */}
      <section className="text-center py-16 space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-green-600">فَذَكِّر</h1>
          <h2 className="text-2xl md:text-3xl font-semibold">
            {locale === "ar" ? "تعلّم الصلاة خطوة بخطوة" : "Learn Prayer Step by Step"}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {locale === "ar" 
              ? "شرح مبسّط مع أدلته من القرآن والسنّة" 
              : "Simple explanation with evidence from Quran and Sunnah"
            }
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
            <Link href="/learn/fajr">
              {locale === "ar" ? "ابدأ الآن" : "Start Now"}
              <ArrowLeft className="mr-2 h-4 w-4 rtl:rotate-180" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/content">
              {locale === "ar" ? "تصفح المحتوى" : "Browse Content"}
            </Link>
          </Button>
        </div>

        <div className="bg-green-50 dark:bg-green-950/20 rounded-2xl p-6 max-w-3xl mx-auto">
          <p className="text-sm text-green-800 dark:text-green-200">
            {locale === "ar"
              ? "المحتوى للتعليم العام، وللفتوى يُرجى الرجوع لأهل العلم الثقات."
              : "Content is for general education. For religious rulings, please consult qualified scholars."
            }
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center text-green-600 mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Prayer Cards */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">
            {locale === "ar" ? "الصلوات الخمس" : "The Five Daily Prayers"}
          </h3>
          <p className="text-muted-foreground">
            {locale === "ar" 
              ? "تعلم كل صلاة بالتفصيل مع الأدلة الشرعية"
              : "Learn each prayer in detail with Islamic evidence"
            }
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {prayers.map((prayer, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <Link href={prayer.href}>
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-4 group-hover:scale-105 transition-transform">
                    {index + 1}
                  </div>
                  <CardTitle className="text-xl">{prayer.name}</CardTitle>
                  {locale === "en" && <CardDescription>{prayer.nameEn}</CardDescription>}
                </CardHeader>
                <CardContent className="text-center">
                  <Badge variant="secondary" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {prayer.time}
                  </Badge>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16">
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-green-800 dark:text-green-200">
                {locale === "ar" ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
              </CardTitle>
              <CardDescription>
                {locale === "ar"
                  ? "إجابات على أكثر الأسئلة شيوعاً حول الصلاة"
                  : "Answers to the most common questions about prayer"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                asChild
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-100 bg-transparent"
              >
                <Link href="/faq">
                  {locale === "ar" ? "تصفح الأسئلة" : "Browse Questions"}
                  <ArrowLeft className="mr-2 h-4 w-4 rtl:rotate-180" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-blue-800 dark:text-blue-200">
                {locale === "ar" ? "المساعد الذكي" : "Smart Assistant"}
              </CardTitle>
              <CardDescription>
                {locale === "ar"
                  ? "اسأل أي سؤال واحصل على إجابة فورية"
                  : "Ask any question and get instant answers"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                asChild
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-100 bg-transparent"
              >
                <Link href="/chat">
                  {locale === "ar" ? "ابدأ المحادثة" : "Start Chat"}
                  <MessageCircle className="mr-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}