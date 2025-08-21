"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useI18n } from "@/lib/i18n"
import { askQuestion } from "@/lib/api"
import { Send, Bot, User, AlertCircle, RefreshCw, Copy, Check } from "lucide-react"
import type { ChatMessage } from "@/types/content"

// Sample questions for quick start
const SAMPLE_QUESTIONS = [
  "كيف أتوضأ؟",
  "ما هي أركان الصلاة؟",
  "كم عدد ركعات كل صلاة؟",
  "متى يبدأ وقت صلاة الظهر؟",
  "ما هي واجبات الصلاة؟"
]

export default function ChatPage() {
  const { t } = useI18n()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)
    setError(null)

    try {
      const response = await askQuestion(input.trim())
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: typeof response.answer === "string" ? response.answer : JSON.stringify(response.answer),
        source: response.source,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage = error instanceof Error ? error.message : "عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى."
      setError(errorMessage)
      
      const botErrorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: errorMessage,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botErrorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleSampleQuestion = (question: string) => {
    setInput(question)
    inputRef.current?.focus()
  }

  const handleRetry = () => {
    setError(null)
    if (messages.length > 0) {
      const lastUserMessage = messages.filter(m => m.type === "user").pop()
      if (lastUserMessage) {
        setInput(lastUserMessage.content)
        inputRef.current?.focus()
      }
    }
  }

  const clearChat = () => {
    setMessages([])
    setError(null)
    setInput("")
    inputRef.current?.focus()
  }

  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(messageId)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">المساعد الذكي للصلاة</h1>
        <p className="text-muted-foreground text-sm sm:text-base px-4">
          اسأل أي سؤال حول الصلاة واحصل على إجابة فورية من الذكاء الاصطناعي
        </p>
      </div>

      {/* Service Status */}
      <Card className="mb-6 border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-green-600" />
            <CardTitle className="text-green-800 dark:text-green-200 text-base">الخدمة متاحة</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-green-700 dark:text-green-300 font-medium">
              المساعد الذكي جاهز للإجابة على أسئلتك
            </p>
            <p className="text-sm text-green-700 dark:text-green-300">
              {t("chat.disclaimer") || "يُرجى التحقق من الإجابات مع العلماء المختصين للتأكد من صحتها"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sample Questions */}
      {messages.length === 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">أسئلة مقترحة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_QUESTIONS.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSampleQuestion(question)}
                  className="text-right text-xs sm:text-sm h-auto py-2 px-3 whitespace-normal leading-tight"
                  disabled={loading}
                >
                  {question}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat Interface */}
      <Card className="h-[500px] sm:h-[600px] flex flex-col">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            المحادثة
          </CardTitle>
          {messages.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearChat} disabled={loading} className="text-xs">
              <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline mr-1">مسح المحادثة</span>
            </Button>
          )}
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <ScrollArea className="flex-1 p-2 sm:p-4" ref={scrollAreaRef}>
            <div className="space-y-3 sm:space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <Bot className="h-12 w-12 mx-auto mb-4 text-green-600" />
                  <p>مرحباً! كيف يمكنني مساعدتك في تعلم الصلاة؟</p>
                  <p className="text-sm mt-2">اختر سؤالاً من الأعلى أو اكتب سؤالك الخاص</p>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex w-full ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  {/* Row container */}
                  <div className={`flex items-start gap-2 max-w-full`}>
                    
                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.type === "user" ? "bg-blue-500 text-white" : "bg-green-500 text-white"
                      }`}
                    >
                      {message.type === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>

                    {/* Bubble */}
                    <div
                      className={`rounded-lg p-3 min-w-0 ${
                        message.type === "user"
                          ? "bg-blue-500 text-white ml-auto"
                          : "bg-muted relative group"
                      }`}
                      style={{ maxWidth: "75%", overflowWrap: "anywhere", wordBreak: "break-word" }}
                    >
                      {message.type === "bot" && message.content.length > 100 && (
                        <button
                          onClick={() => copyToClipboard(message.content, message.id)}
                          className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 z-10"
                          title="نسخ الإجابة"
                        >
                          {copiedId === message.id ? (
                            <Check className="h-3 w-3 text-green-600" />
                          ) : (
                            <Copy className="h-3 w-3 text-gray-600" />
                          )}
                        </button>
                      )}

                      <div className="text-sm leading-relaxed space-y-2">
                        {message.content.split('\n\n').map((paragraph, index) => (
                          <p 
                            key={index} 
                            className={`${paragraph.startsWith('**') ? 'font-semibold' : ''}`}
                          >
                            {paragraph.replace(/\*\*/g, '')}
                          </p>
                        ))}
                      </div>

                      {message.source && (
                        <p className="text-xs mt-2 opacity-75 font-medium">
                          المصدر: {message.source}
                        </p>
                      )}
                      <p className="text-xs mt-1 opacity-60">
                        {message.timestamp.toLocaleTimeString('ar-SA')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Error Display */}
          {error && (
            <div className="px-2 sm:px-4 pb-2">
              <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-red-700 dark:text-red-300 break-words">{error}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleRetry} 
                  disabled={loading}
                  className="text-xs px-2 py-1 h-auto"
                >
                  إعادة المحاولة
                </Button>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t p-2 sm:p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("chat.placeholder") || "اكتب سؤالك هنا..."}
                disabled={loading}
                className="flex-1 text-sm"
                maxLength={500}
              />
              <Button 
                type="submit" 
                disabled={!input.trim() || loading} 
                className="bg-green-600 hover:bg-green-700 px-2 sm:px-3"
                size="sm"
              >
                {loading ? (
                  <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                ) : (
                  <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                )}
              </Button>
            </form>
            {input.length > 400 && (
              <p className="text-xs text-muted-foreground mt-1 text-right">
                {500 - input.length} حرف متبقي
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
