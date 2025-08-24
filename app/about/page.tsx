"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Shield, Users, Heart } from "lucide-react"
import { useI18n } from "@/lib/i18n"

export default function AboutPage() {
  const { t, locale } = useI18n()

  const sources = [
    "القرآن الكريم",
    "صحيح البخاري", 
    "صحيح مسلم",
    "سنن أبي داود",
    "سنن الترمذي",
    "سنن النسائي",
    "سنن ابن ماجه",
  ]

  const sourcesEn = [
    "The Holy Quran",
    "Sahih Bukhari",
    "Sahih Muslim", 
    "Sunan Abu Dawood",
    "Sunan Tirmidhi",
    "Sunan Nasa'i",
    "Sunan Ibn Majah",
  ]

  const features = [
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: locale === "ar" ? "مصادر موثقة" : "Authentic Sources",
      description: locale === "ar" 
        ? "جميع المعلومات مستقاة من القرآن الكريم والسنة النبوية الصحيحة"
        : "All information is derived from the Holy Quran and authentic Prophetic traditions",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: locale === "ar" ? "محتوى آمن" : "Safe Content",
      description: locale === "ar"
        ? "تم مراجعة المحتوى من قبل متخصصين في الشريعة الإسلامية"
        : "Content reviewed by specialists in Islamic jurisprudence",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: locale === "ar" ? "للجميع" : "For Everyone",
      description: locale === "ar"
        ? "مناسب للمبتدئين والمتقدمين في تعلم أحكام الصلاة"
        : "Suitable for beginners and advanced learners of prayer rulings",
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: locale === "ar" ? "مجاني" : "Free",
      description: locale === "ar"
        ? "خدمة مجانية بالكامل لوجه الله تعالى"
        : "Completely free service for the sake of Allah",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">
          {locale === "ar" ? "حول فَذَكِّر" : "About Fa-dhakker"}
        </h1>
        <p className="text-lg text-muted-foreground">
          {locale === "ar" 
            ? "منصة تعليمية لتعلم الصلاة وفق الكتاب والسنة"
            : "Educational platform for learning prayer according to Quran and Sunnah"
          }
        </p>
      </div>

      {/* Mission */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{locale === "ar" ? "رسالتنا" : "Our Mission"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="leading-relaxed">
            {locale === "ar" 
              ? "نهدف إلى تسهيل تعلم الصلاة للمسلمين في جميع أنحاء العالم من خلال منصة تفاعلية تجمع بين البساطة في العرض والدقة في المحتوى، مع الاعتماد على المصادر الشرعية الموثقة."
              : "We aim to facilitate learning prayer for Muslims around the world through an interactive platform that combines simplicity in presentation with accuracy in content, relying on authenticated Islamic sources."
            }
          </p>
          <p className="leading-relaxed">
            {locale === "ar"
              ? "نؤمن بأن الصلاة هي عماد الدين، ولذلك نسعى لتقديم محتوى تعليمي عالي الجودة يساعد المسلمين على أداء صلاتهم بالطريقة الصحيحة."
              : "We believe that prayer is the pillar of religion, therefore we strive to provide high-quality educational content that helps Muslims perform their prayers correctly."
            }
          </p>
        </CardContent>
      </Card>

      {/* Features */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {features.map((feature, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center text-green-600">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sources */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>
            {locale === "ar" ? "المصادر الشرعية" : "Islamic Sources"}
          </CardTitle>
          <CardDescription>
            {locale === "ar"
              ? "نعتمد في محتوانا على المصادر الشرعية الموثقة التالية:"
              : "We rely on the following authenticated Islamic sources for our content:"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {(locale === "ar" ? sources : sourcesEn).map((source, index) => (
              <Badge key={index} variant="secondary" className="text-sm">
                {source}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
        <CardHeader>
          <CardTitle className="text-amber-800 dark:text-amber-200">
            {locale === "ar" ? "إخلاء مسؤولية" : "Disclaimer"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-amber-700 dark:text-amber-300">
            <p>
              {locale === "ar"
                ? "المحتوى المقدم في هذه المنصة هو للأغراض التعليمية العامة فقط، وهو مبني على فهمنا للنصوص الشرعية والمصادر المعتمدة."
                : "The content provided on this platform is for general educational purposes only and is based on our understanding of Islamic texts and approved sources."
              }
            </p>
            <p>
              {locale === "ar"
                ? "للحصول على فتاوى شرعية أو إجابات على مسائل فقهية معقدة، يُرجى الرجوع إلى العلماء المختصين وأهل العلم الثقات."
                : "For religious rulings or answers to complex jurisprudential matters, please refer to qualified scholars and trusted people of knowledge."
              }
            </p>
            <p>
              {locale === "ar"
                ? "نحن نبذل قصارى جهدنا لضمان دقة المعلومات، ولكننا لا نتحمل المسؤولية عن أي أخطاء قد تحدث. نرحب بملاحظاتكم وتصحيحاتكم."
                : "We make every effort to ensure the accuracy of information, but we do not take responsibility for any errors that may occur. We welcome your feedback and corrections."
              }
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <div className="text-center mt-8 pt-8 border-t">
        <p className="text-muted-foreground">
          {locale === "ar" 
            ? "للتواصل معنا أو الإبلاغ عن أخطاء:"
            : "To contact us or report errors:"
          }
          <a href="mailto:achrafrejouan@gmail.com" className="text-green-600 hover:underline mr-2">
            achrafrejouan@gmail.com
          </a>
        </p>
      </div>
    </div>
  )
}