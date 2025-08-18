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

const API_BASE = process.env.NEXT_PUBLIC_API_BASE

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
  if (!API_BASE) {
    throw new ApiError("API base URL not configured")
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000)

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new ApiError(`HTTP ${response.status}`, response.status)
    }

    return await response.json()
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof ApiError) throw error
    throw new ApiError("Network error")
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
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: question }),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const data = await response.json()
    return {
      answer: data.response,
      source: data.source,
    }
  } catch (error) {
    console.error("Chat API error:", error)
    throw new Error("فشل في الاتصال بالمساعد الذكي")
  }
}
