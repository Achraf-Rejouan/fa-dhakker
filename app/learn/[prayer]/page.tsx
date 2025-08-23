"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  LoadingCard,
  StatusCard 
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { PrayerPose } from "@/components/prayer-pose"
import { DalilCard } from "@/components/ui/dalil-card"
import { useI18n } from "@/lib/i18n"
import { getSteps } from "@/lib/api"
import { ChevronLeft, ChevronRight, Play, Pause, BookOpen, CheckCircle, Clock } from "lucide-react"
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

  useEffect(() => {
    async function loadSteps() {
      try {
        setLoading(true)
        setError(null)
        const data = await getSteps(prayer)
        setSteps(data)
      } catch (error) {
        console.error("Failed to load steps:", error)
        setError(t("error") || "Failed to load prayer steps")
      } finally {
        setLoading(false)
      }
    }

    loadSteps()
  }, [prayer, t])

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
    if (e.key === "Escape") {
      setIsPlaying(false)
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [currentStep, isPlaying, steps.length])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t("loading") || "Loading prayer steps..."}</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <LoadingCard lines={4} />
            <LoadingCard lines={6} />
          </div>
          <div className="space-y-4">
            <LoadingCard lines={2} />
            {Array.from({ length: 5 }).map((_, i) => (
              <LoadingCard key={i} lines={1} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || steps.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <StatusCard 
            status="error" 
            title={t("error") || "Error"}
            description={error || t("error.no_steps") || "No prayer steps found"}
            icon={<BookOpen className="h-5 w-5" />}
          />
          <div className="text-center mt-6">
            <Button onClick={() => window.location.reload()} variant="outline">
              {t("retry") || "Try Again"}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const step = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">{t(`prayers.${prayer}`) || prayer}</h1>
        
        <div className="flex items-center justify-center gap-6 mb-6">
          <Badge variant="outline" className="text-sm font-medium">
            {t("step")} {currentStep + 1} {t("of")} {steps.length}
          </Badge>
          <div className="flex items-center gap-2">
            <Progress value={progress} className="w-32 h-2" />
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex justify-center gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{t("estimated_time") || "Est."} {steps.length * 3}s</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4" />
            <span>{currentStep + 1}/{steps.length} {t("completed") || "completed"}</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Animation & Content */}
        <div className="space-y-6">
          {/* Main Step Card */}
          <Card variant="elevated" className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">
                  {locale === "ar" ? step.title_ar : step.title_en || step.title_ar}
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="shrink-0"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      {t("pause") || "Pause"}
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      {t("play") || "Play"}
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Animation Container */}
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-xl p-8 border border-green-200/50 dark:border-green-800/50">
                  <PrayerPose pose={step.svgId} animate={isPlaying} />
                </div>
                
                {/* Play indicator */}
                {isPlaying && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full shadow-lg animate-pulse">
                    <Play className="h-4 w-4" />
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h3 className="font-medium text-lg">{t("description") || "Description"}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {locale === "ar" ? step.description_ar : step.description_en || step.description_ar}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Evidence Card */}
          {step.dalil && step.dalil.length > 0 && (
            <DalilCard dalil={step.dalil} />
          )}

          {/* Navigation Controls */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center gap-4">
                <Button 
                  variant="outline" 
                  onClick={handlePrev} 
                  disabled={isFirstStep}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
                  {t("step.prev") || "Previous"}
                </Button>

                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 text-xs bg-muted rounded border">←→</kbd>
                  <span className="text-xs text-muted-foreground">{t("keyboard_nav") || "Use arrow keys"}</span>
                </div>

                <Button
                  onClick={handleNext}
                  disabled={isLastStep}
                  className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                >
                  {t("step.next") || "Next"}
                  <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Steps Navigation Sidebar */}
        <div className="space-y-6">
          <div className="sticky top-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {t("steps") || "Steps"}
            </h2>
            
            <div className="space-y-3 max-h-[70vh] overflow-y-auto">
              {steps.map((s, index) => {
                const isActive = index === currentStep
                const isCompleted = index < currentStep
                
                return (
                  <Card
                    key={s.id}
                    interactive
                    variant={isActive ? "outlined" : "default"}
                    className={`transition-all duration-200 ${
                      isActive 
                        ? "border-green-500 bg-green-50 dark:bg-green-950/20 shadow-md scale-[1.02]" 
                        : isCompleted
                          ? "border-green-200 bg-green-50/50 dark:bg-green-950/10"
                          : "hover:shadow-md hover:scale-[1.01]"
                    }`}
                    onClick={() => setCurrentStep(index)}
                  >
                    <CardHeader className="py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                            isActive
                              ? "bg-green-500 text-white shadow-lg"
                              : isCompleted
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base leading-tight truncate">
                            {locale === "ar" ? s.title_ar : s.title_en || s.title_ar}
                          </CardTitle>
                          {isActive && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {t("current_step") || "Current step"}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                )
              })}
            </div>

            {/* Progress Summary */}
            <Card variant="ghost" className="mt-6">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(progress)}%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t("progress_complete") || "Complete"}
                  </p>
                  <Progress value={progress} className="w-full h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Completion Celebration */}
      {isLastStep && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card variant="elevated" className="max-w-md w-full text-center animate-in zoom-in-95">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">
                {t("congratulations") || "Congratulations!"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                {t("prayer_completed") || `You have completed learning ${prayer} prayer!`}
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => setCurrentStep(0)}>
                  {t("start_over") || "Start Over"}
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => window.location.href = "/"}
                >
                  {t("back_home") || "Back to Home"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}