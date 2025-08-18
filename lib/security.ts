import { headers } from "next/headers"

// Rate limiting configuration
const RATE_LIMITS = {
  api: { requests: 100, window: 60000 }, // 100 requests per minute
  chat: { requests: 20, window: 60000 }, // 20 chat requests per minute
}

// In-memory rate limiting (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(key: string, limit: { requests: number; window: number }) {
  const now = Date.now()
  const record = rateLimitStore.get(key)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + limit.window })
    return { success: true, remaining: limit.requests - 1 }
  }

  if (record.count >= limit.requests) {
    return { success: false, remaining: 0, resetTime: record.resetTime }
  }

  record.count++
  return { success: true, remaining: limit.requests - record.count }
}

export function getClientIP(): string {
  const headersList = headers()
  const forwarded = headersList.get("x-forwarded-for")
  const realIP = headersList.get("x-real-ip")

  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }

  return realIP || "unknown"
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove script tags
    .replace(/javascript:/gi, "") // Remove javascript: protocols
    .replace(/on\w+\s*=/gi, "") // Remove event handlers
    .trim()
}

export function validateChatMessage(message: string): { valid: boolean; error?: string } {
  if (!message || typeof message !== "string") {
    return { valid: false, error: "Message is required and must be a string" }
  }

  if (message.length > 1000) {
    return { valid: false, error: "Message too long (max 1000 characters)" }
  }

  if (message.length < 3) {
    return { valid: false, error: "Message too short (min 3 characters)" }
  }

  // Check for potential malicious content
  const suspiciousPatterns = [/<script/i, /javascript:/i, /data:text\/html/i, /vbscript:/i]

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(message)) {
      return { valid: false, error: "Message contains potentially harmful content" }
    }
  }

  return { valid: true }
}

export const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;",
}
