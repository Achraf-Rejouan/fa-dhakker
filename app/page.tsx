"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, BookOpen, MessageCircle } from "lucide-react"
import { ArabicLogoAnimation } from "@/components/ui/arabic-logo-animation"
import { useState } from "react"

export default function HomePage() {
  const [showAnimation, setShowAnimation] = useState(true)

  const prayers = [
    { name: "الفجر", nameEn: "Fajr", time: "قبل الشروق", href: "/learn/fajr" },
    { name: "الظهر", nameEn: "Dhuhr", time: "بعد الزوال", href: "/learn/dhuhr" },
    { name: "العصر", nameEn: "Asr", time: "بعد الظهر", href: "/learn/asr" },
    { name: "المغرب", nameEn: "Maghrib", time: "عند الغروب", href: "/learn/maghrib" },
    { name: "العشاء", nameEn: "Isha", time: "بعد المغرب", href: "/learn/isha" },
  ]

  const features = [
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "أدلة شرعية",
      description: "كل خطوة مدعومة بآيات قرآنية وأحاديث صحيحة",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "تعلم تدريجي",
      description: "خطوات مبسطة مع رسوم توضيحية متحركة",
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "مساعد ذكي",
      description: "اسأل أي سؤال واحصل على إجابة فورية",
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
          <h2 className="text-2xl md:text-3xl font-semibold">تعلّم الصلاة خطوة بخطوة</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">شرح مبسّط مع أدلته من القرآن والسنّة</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
            <Link href="/learn/fajr">
              ابدأ الآن
              <ArrowLeft className="mr-2 h-4 w-4 rtl:rotate-180" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/content">تصفح المحتوى</Link>
          </Button>
        </div>

        <div className="bg-green-50 dark:bg-green-950/20 rounded-2xl p-6 max-w-3xl mx-auto">
          <p className="text-sm text-green-800 dark:text-green-200">
            المحتوى للتعليم العام، وللفتوى يُرجى الرجوع لأهل العلم الثقات.
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
          <h3 className="text-3xl font-bold mb-4">الصلوات الخمس</h3>
          <p className="text-muted-foreground">تعلم كل صلاة بالتفصيل مع الأدلة الشرعية</p>
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
                  <CardDescription>{prayer.nameEn}</CardDescription>
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
              <CardTitle className="text-green-800 dark:text-green-200">الأسئلة الشائعة</CardTitle>
              <CardDescription>إجابات على أكثر الأسئلة شيوعاً حول الصلاة</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                asChild
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-100 bg-transparent"
              >
                <Link href="/faq">
                  تصفح الأسئلة
                  <ArrowLeft className="mr-2 h-4 w-4 rtl:rotate-180" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-blue-800 dark:text-blue-200">المساعد الذكي</CardTitle>
              <CardDescription>اسأل أي سؤال واحصل على إجابة فورية</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                asChild
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-100 bg-transparent"
              >
                <Link href="/chat">
                  ابدأ المحادثة
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
