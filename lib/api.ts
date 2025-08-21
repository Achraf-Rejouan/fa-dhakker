// lib/api.ts
import type { Step, ContentItem, FaqItem } from "@/types/content"

import stepsFajr from "@/data/steps.fajr.json"
import stepsDhuhr from "@/data/steps.dhuhr.json"
import stepsAsr from "@/data/steps.asr.json"
import stepsMaghrib from "@/data/steps.maghrib.json"
import stepsIsha from "@/data/steps.isha.json"
import contentsArkan from "@/data/contents.arkan.json"
import contentsWajibat from "@/data/contents.wajibat.json"
import contentsSunan from "@/data/contents.sunan.json"
import contentsShuroot from "@/data/contents.shuroot.json"
import faqData from "@/data/faq.json"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || ''

const stepsMap: Record<string, Step[]> = {
  fajr: stepsFajr,
  dhuhr: stepsDhuhr,
  asr: stepsAsr,
  maghrib: stepsMaghrib,
  isha: stepsIsha,
}

const contentsMap: Record<string, ContentItem[]> = {
  arkan: contentsArkan,
  wajibat: contentsWajibat,
  sunan: contentsSunan,
  shuroot: contentsShuroot,
}

class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
  if (!API_BASE && !endpoint.startsWith('/api/')) {
    throw new ApiError("API base URL not configured")
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 30000) // Increased timeout for AI responses

  try {
    const url = endpoint.startsWith('/api/') ? endpoint : `${API_BASE}${endpoint}`
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage = errorData.error || `HTTP ${response.status}`
      throw new ApiError(errorMessage, response.status)
    }

    return await response.json()
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof ApiError) throw error
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError("انتهت مهلة الاتصال. يرجى المحاولة مرة أخرى.")
    }
    throw new ApiError("خطأ في الاتصال. يرجى التحقق من الإنترنت.")
  }
}

export async function getSteps(prayer: string): Promise<Step[]> {
  try {
    return await fetchJson<Step[]>(`/api/steps?prayer=${prayer}`)
  } catch (error) {
    console.log("API failed, using local data for prayer:", prayer)
    return stepsMap[prayer] || []
  }
}

export async function getContents(type: string): Promise<ContentItem[]> {
  try {
    return await fetchJson<ContentItem[]>(`/api/contents?type=${type}`)
  } catch (error) {
    console.log("API failed, using local data for content type:", type)
    return contentsMap[type] || []
  }
}

export async function getFaq(): Promise<FaqItem[]> {
  try {
    return await fetchJson<FaqItem[]>("/api/faq")
  } catch (error) {
    console.log("API failed, using local FAQ data")
    return faqData
  }
}

export async function askQuestion(question: string): Promise<{ answer: string; source?: string }> {
  if (!question || question.trim().length === 0) {
    throw new Error("يرجى كتابة سؤال صالح")
  }

  if (question.length > 500) {
    throw new Error("السؤال طويل جداً. يرجى اختصاره إلى أقل من 500 حرف.")
  }

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: question.trim() }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage = errorData.error || `HTTP ${response.status}`
      
      // Handle specific error codes
      if (response.status === 429) {
        throw new Error("تم تجاوز حد الطلبات. يرجى الانتظار قليلاً والمحاولة مرة أخرى.")
      } else if (response.status === 500) {
        throw new Error("خطأ في الخادم. يرجى المحاولة لاحقاً.")
      } else if (response.status === 400) {
        throw new Error("طلب غير صالح. يرجى التحقق من السؤال.")
      }
      
      throw new Error(errorMessage)
    }

    const data = await response.json()
    
    if (!data.response) {
      throw new Error("لم يتم الحصول على رد من الخدمة")
    }

    return {
      answer: data.response,
      source: data.source,
    }
  } catch (error) {
    console.error("Chat API error:", error)
    
    if (error instanceof Error) {
      // Re-throw known errors
      throw error
    }
    
    // Generic fallback error
    throw new Error("فشل في الاتصال بالمساعد الذكي. يرجى المحاولة مرة أخرى.")
  }
}

// Utility function to check if chat service is available
export async function checkChatService(): Promise<boolean> {
  try {
    const response = await fetch("/api/chat", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    return response.ok
  } catch {
    return false
  }
}