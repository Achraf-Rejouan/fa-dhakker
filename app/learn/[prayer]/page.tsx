"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { PrayerPose } from "@/components/prayer-pose"
import { DalilCard } from "@/components/ui/dalil-card"
import { useI18n } from "@/lib/i18n"
import { getSteps } from "@/lib/api"
import { ChevronLeft, ChevronRight, Play, Pause, BookOpen } from "lucide-react"
import type { Step } from "@/types/content"

export default function LearnPrayerPage() {
  const params = useParams()
  const { t, locale } = useI18n()
  const prayer = params.prayer as string

  const [steps, setSteps] = useState<Step[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load steps
  useEffect(() => {
    async function loadSteps() {
      try {
        setLoading(true)
        const data = await getSteps(prayer)
        setSteps(data)
      } catch (error) {
        setError("Failed to load prayer steps")
      } finally {
        setLoading(false)
      }
    }
    loadSteps()
  }, [prayer])

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || currentStep >= steps.length - 1) return
    
    const timer = setTimeout(() => {
      setCurrentStep(prev => prev + 1)
    }, 3000)
    
    return () => clearTimeout(timer)
  }, [isPlaying, currentStep, steps.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
          handleNext()
          break
        case "ArrowLeft":
          handlePrev()
          break
        case " ":
          e.preventDefault()
          setIsPlaying(!isPlaying)
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [currentStep, isPlaying, steps.length])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading prayer steps...</p>
      </div>
    )
  }

  // Error state
  if (error || steps.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-600 mb-4">{error || "No prayer steps found"}</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  const step = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold mb-4">
          {t(`prayers.${prayer}`) || prayer}
        </h1>
        
        <div className="flex items-center justify-center gap-4 mb-4">
          <Badge variant="outline" className="text-sm px-3 py-1">
            {locale === "ar" ? `الخطوة ${currentStep + 1} من ${steps.length}` : `Step ${currentStep + 1} of ${steps.length}`}
          </Badge>
          <Progress value={progress} className="w-40 h-2" />
          <span className="text-sm text-muted-foreground">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step Card */}
          <Card className="p-1">
            <CardHeader className="pb-4 pt-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl lg:text-2xl">
                  {locale === "ar" ? step.title_ar : step.title_en || step.title_ar}
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="default"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-4"
                >
                  {isPlaying ? (
                    <><Pause className="h-4 w-4 mr-2" /> {locale === "ar" ? "إيقاف" : "Pause"}</>
                  ) : (
                    <><Play className="h-4 w-4 mr-2" /> {locale === "ar" ? "تشغيل" : "Play"}</>
                  )}
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Animation */}
              <div className="aspect-square bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-xl p-6 lg:p-8">
                <PrayerPose pose={step.svgId} animate={isPlaying} />
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-3">{locale === "ar" ? "الوصف" : "Description"}</h3>
                <p className="text-muted-foreground text-base leading-relaxed pb-5">
                  {locale === "ar" ? step.description_ar : step.description_en || step.description_ar}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Evidence */}
          {step.dalil && step.dalil.length > 0 && (
            <DalilCard dalil={step.dalil} />
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center py-2">
            <Button 
              variant="outline" 
              size="default"
              onClick={handlePrev} 
              disabled={currentStep === 0}
              className="px-6"
            >
              <ChevronLeft className="h-4 w-4 mr-2 rtl:rotate-180" />
              {locale === "ar" ? "السابق" : "Previous"}
            </Button>

            <div className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-md">
              {locale === "ar" ? "استخدم ← → للتنقل" : "Use ← → keys to navigate"}
            </div>

            <Button
              onClick={handleNext}
              disabled={currentStep === steps.length - 1}
              className="bg-green-600 hover:bg-green-700 px-6"
              size="default"
            >
              {locale === "ar" ? "التالي" : "Next"}
              <ChevronRight className="h-4 w-4 ml-2 rtl:rotate-180" />
            </Button>
          </div>
        </div>

        {/* Steps Sidebar */}
        <div>
          <h2 className="text-lg lg:text-xl font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {locale === "ar" ? "الخطوات" : "Steps"}
          </h2>
          
          <div className="grid gap-3">
            {steps.map((s, index) => (
              <Card
                key={s.id}
                className={`cursor-pointer transition-all h-18 lg:h-20 ${
                  index === currentStep 
                    ? "border-green-500 bg-green-50 dark:bg-green-950/20 shadow-md" 
                    : index < currentStep
                      ? "bg-green-50/50 dark:bg-green-950/10 border-green-200"
                      : "hover:bg-gray-50 dark:hover:bg-gray-900/50 hover:shadow-sm"
                }`}
                onClick={() => setCurrentStep(index)}
              >
                <CardContent className="p-3 h-full flex items-center">
                  <div className="flex items-center gap-3 w-full">
                    <div
                      className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                        index === currentStep
                          ? "bg-green-500 text-white shadow-lg"
                          : index < currentStep
                            ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium leading-tight">
                      {locale === "ar" ? s.title_ar : s.title_en || s.title_ar}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {currentStep === steps.length - 1 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-sm w-full text-center">
            <CardHeader>
              <CardTitle>🎉 {locale === "ar" ? "تهانينا!" : "Congratulations!"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                {locale === "ar" 
                  ? `لقد أكملت تعلم صلاة ${prayer} `
                  : `You completed the ${prayer} prayer `
                }
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => setCurrentStep(0)}>
                  {locale === "ar" ? "البدء من جديد" : "Start Over"}
                </Button>
                <Button onClick={() => window.location.href = "/"}>
                  {locale === "ar" ? "العودة للرئيسية" : "Back Home"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}