"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { PrayerPose } from "@/components/svg/prayer-pose"
import { DalilCard } from "@/components/ui/dalil-card"
import { useI18n } from "@/lib/i18n"
import { getSteps } from "@/lib/api"
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"
import type { Step } from "@/types/content"

export default function LearnPrayerPage() {
  const params = useParams()
  const { t, locale } = useI18n()
  const prayer = params.prayer as string

  const [steps, setSteps] = useState<Step[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSteps() {
      try {
        const data = await getSteps(prayer)
        setSteps(data)
      } catch (error) {
        console.error("Failed to load steps:", error)
      } finally {
        setLoading(false)
      }
    }

    loadSteps()
  }, [prayer])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && currentStep < steps.length - 1) {
      interval = setTimeout(() => {
        setCurrentStep((prev) => prev + 1)
      }, 3000)
    } else if (isPlaying && currentStep === steps.length - 1) {
      setIsPlaying(false)
    }
    return () => clearTimeout(interval)
  }, [isPlaying, currentStep, steps.length])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") handleNext()
    if (e.key === "ArrowLeft") handlePrev()
    if (e.key === " ") {
      e.preventDefault()
      setIsPlaying(!isPlaying)
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [currentStep, isPlaying])

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

  if (steps.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-muted-foreground">{t("error")}</p>
        </div>
      </div>
    )
  }

  const step = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">{t(`prayers.${prayer}`)}</h1>
        <div className="flex items-center justify-center gap-4 mb-4">
          <Badge variant="outline">
            {currentStep + 1} / {steps.length}
          </Badge>
          <Progress value={progress} className="w-32" />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        

        {/* Animation & Content */}
        <div className="space-y-6">
          {/* Animation */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{locale === "ar" ? step.title_ar : step.title_en || step.title_ar}</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-muted/20 rounded-lg p-8 mb-4">
                <PrayerPose pose={step.svgId} animate={true} />
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {locale === "ar" ? step.description_ar : step.description_en || step.description_ar}
              </p>
            </CardContent>
          </Card>

          {/* Evidence */}
          {step.dalil && step.dalil.length > 0 && <DalilCard dalil={step.dalil} />}

          {/* Navigation */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={handlePrev} disabled={currentStep === 0}>
              <ChevronRight className="h-4 w-4 mr-2 rtl:rotate-180" />
              {t("step.prev")}
            </Button>
            <Button
              onClick={handleNext}
              disabled={currentStep === steps.length - 1}
              className="bg-green-600 hover:bg-green-700"
            >
              {t("step.next")}
              <ChevronLeft className="h-4 w-4 ml-2 rtl:rotate-180" />
            </Button>
          </div>
        </div>

        {/* Step List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">الخطوات</h2>
          <div className="space-y-2">
            {steps.map((s, index) => (
              <Card
                key={s.id}
                className={`cursor-pointer transition-colors ${
                  index === currentStep ? "border-green-500 bg-green-50 dark:bg-green-950/20" : "hover:bg-muted/50"
                }`}
                onClick={() => setCurrentStep(index)}
              >
                <CardHeader className="py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        index === currentStep
                          ? "bg-green-500 text-white"
                          : index < currentStep
                            ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        {locale === "ar" ? s.title_ar : s.title_en || s.title_ar}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
