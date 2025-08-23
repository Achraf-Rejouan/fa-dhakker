"use client"

import React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Send, Bot, User, AlertCircle, RefreshCw, Copy, Check, Trash2, MessageSquare } from "lucide-react"
import { useI18n } from "@/lib/i18n"

interface ChatMessage {
  id: string
  type: "user" | "bot"
  content: string
  source?: string
  timestamp: Date
}

// Button Component
const Button = React.forwardRef(({ 
  className = "", 
  variant = "default", 
  size = "default", 
  disabled = false,
  children, 
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
  
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground"
  }
  
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8"
  }
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
})

// Input Component
const Input = React.forwardRef(({ className = "", ...props }, ref) => (
  <input
    className={`flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    ref={ref}
    {...props}
  />
))

// Card Components
const Card = ({ children, className = "" }) => (
  <div className={`rounded-xl border border-border bg-card text-card-foreground shadow-sm ${className}`}>
    {children}
  </div>
)

const CardHeader = ({ children, className = "" }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
)

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
)

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
)

// ScrollArea Component
const ScrollArea = ({ children, className = "", ref }) => (
  <div className={`relative overflow-auto ${className}`} ref={ref}>
    {children}
  </div>
)

export default function ChatPage() {
  const { t, locale, setLocale, dir } = useI18n()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [copiedId, setCopiedId] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState("basics")
  const scrollAreaRef = useRef(null)
  const inputRef = useRef(null)
  

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = {
      id: Date.now().toString(),
      type: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = input.trim()
    setInput("")
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          history: messages.slice(-8).map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.content
          }))
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'حدث خطأ في الاتصال')
      }

      const data = await response.json()
      const botMessage = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: data.response,
        source: data.source,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage = error.message || "عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى."
      setError(errorMessage)
      
      const botErrorMessage = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: errorMessage,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botErrorMessage])
    } finally {
      setLoading(false)
    }
  }, [input, loading, messages])

  const handleSampleQuestion = useCallback((question) => {
    setInput(question)
    inputRef.current?.focus()
  }, [])

  const handleRetry = useCallback(() => {
    setError(null)
    if (messages.length > 0) {
      const lastUserMessage = messages.filter(m => m.type === "user").pop()
      if (lastUserMessage) {
        setInput(lastUserMessage.content)
        inputRef.current?.focus()
      }
    }
  }, [messages])

  const clearChat = useCallback(() => {
    setMessages([])
    setError(null)
    setInput("")
    inputRef.current?.focus()
  }, [])

  const copyToClipboard = async (text, messageId) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(messageId)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const quickActionQuestions = {
    ar: [
      { key: "wudu", text: "كيف أتوضأ؟" },
      { key: "pillars", text: "ما هي أركان الصلاة؟" },
      { key: "times", text: "متى أوقات الصلاة؟" }
    ],
    en: [
      { key: "wudu", text: "How to perform ablution?" },
      { key: "pillars", text: "What are the pillars of prayer?" },
      { key: "times", text: "When are prayer times?" }
    ]
  }

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">


        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-green-600">
              {t("chat.title")}
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("chat.subtitle")}
          </p>
        </div>

        {/* Chat Interface */}
        <Card className="shadow-xl border-border bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <Bot className="w-6 h-6 text-green-600" />
              {t("chat.conversation")}
              {messages.length > 0 && (
                <span className="text-sm text-muted-foreground font-normal">
                  ({messages.length} {t("chat.messages")})
                </span>
              )}
            </CardTitle>
            {messages.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearChat} 
                disabled={loading}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 ml-1" />
                {t("chat.clear")}
              </Button>
            )}
          </CardHeader>

          <CardContent className="p-0">
            {/* Messages Area */}
            <ScrollArea className="h-[500px] md:h-[600px] px-6" ref={scrollAreaRef}>
              <div className="space-y-6 py-4">
                {messages.length === 0 && (
                  <div className="text-center text-muted-foreground py-12">
                    <Bot className="w-16 h-16 mx-auto mb-4 text-green-600 opacity-70" />
                    <h3 className="text-xl font-medium mb-2">{t("chat.greeting")}</h3>
                    <p className="text-lg">{t("chat.welcome")}</p>
                  </div>
                )}

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex w-full ${
                      message.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div className={`flex items-start gap-3 max-w-[85%] ${
                      message.type === "user" ? "flex-row-reverse" : "flex-row"
                    }`}>
                      {/* Avatar */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${
                          message.type === "user" 
                            ? "bg-blue-600 text-white" 
                            : "bg-green-600 text-white"
                        }`}
                      >
                        {message.type === "user" ? 
                          <User className="w-5 h-5" /> : 
                          <Bot className="w-5 h-5" />
                        }
                      </div>

                      {/* Message Bubble */}
                      <div
                        className={`rounded-2xl p-4 shadow-sm relative group ${
                          message.type === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-muted text-foreground"
                        }`}
                      >
                        {/* Copy Button for Bot Messages */}
                        {message.type === "bot" && message.content.length > 50 && (
                          <button
                            onClick={() => copyToClipboard(message.content, message.id)}
                            className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-accent"
                            title={t("chat.copy")}
                          >
                            {copiedId === message.id ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4 text-muted-foreground" />
                            )}
                          </button>
                        )}

                        {/* Message Content */}
                        <div className="leading-relaxed">
                          {message.content.split('\n\n').map((paragraph, index) => (
                            <p key={index} className={`${index > 0 ? 'mt-3' : ''} ${
                              paragraph.startsWith('**') ? 'font-semibold' : ''
                            }`}>
                              {paragraph.replace(/\*\*/g, '')}
                            </p>
                          ))}
                        </div>

                        {/* Source and Timestamp */}
                        <div className={`mt-3 pt-2 border-t ${
                          message.type === "user" 
                            ? "border-white/20" 
                            : "border-border"
                        }`}>
                          {message.source && (
                            <p className="text-xs opacity-75 font-medium mb-1">
                              📚 {t("chat.source")}: {message.source}
                            </p>
                          )}
                          <p className="text-xs opacity-60">
                            🕐 {message.timestamp.toLocaleTimeString(locale === 'ar' ? 'ar-SA' : 'en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Loading Indicator */}
                {loading && (
                  <div className="flex justify-start">
                    <div className="flex items-start gap-3 max-w-[85%]">
                      <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center shadow-md">
                        <Bot className="w-5 h-5" />
                      </div>
                      <div className="bg-muted rounded-2xl p-4 shadow-sm">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                            <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                          </div>
                          <span className="text-sm text-muted-foreground">{t("chat.typing")}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Error Display */}
            {error && (
              <div className="px-6 pb-4">
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-red-700 font-medium mb-2">{t("chat.error")}</p>
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleRetry} 
                    disabled={loading}
                    className="text-red-600 hover:text-red-700 hover:bg-red-100"
                  >
                    <RefreshCw className="w-4 h-4 ml-1" />
                    {t("chat.retry")}
                  </Button>
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="border-t border-border bg-muted/50 p-6 rounded-b-xl">
              <form onSubmit={handleSubmit} className="flex gap-3">
                <div className="flex-1">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t("chat.placeholder")}
                    disabled={loading}
                    className="text-base py-3 px-4 rounded-xl border-2 border-input focus:border-green-600 transition-colors"
                    maxLength={1000}
                    dir={dir}
                  />
                  {input.length > 800 && (
                    <p className="text-xs text-muted-foreground mt-2" style={{ textAlign: dir === 'rtl' ? 'right' : 'left' }}>
                      {t("chat.remaining")} {1000 - input.length} {t("chat.characters")}
                    </p>
                  )}
                </div>
                <button 
                  type="submit" 
                  disabled={!input.trim() || loading || input.length > 1000} 
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 h-11 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                >
                  {loading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </form>
              
              {/* Quick Actions */}
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                <span className="text-xs text-muted-foreground">{t("chat.quickActions")}</span>
                {quickActionQuestions[locale].map((action) => (
                  <button
                    key={action.key}
                    onClick={() => handleSampleQuestion(action.text)}
                    className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                    disabled={loading}
                  >
                    {t(`chat.${action.key}`)}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p className="mb-2">
            {t("footer.blessing")}
          </p>
          <p>
            {t("footer.disclaimer")}
          </p>
        </div>
      </div>
    </div>
  )
}