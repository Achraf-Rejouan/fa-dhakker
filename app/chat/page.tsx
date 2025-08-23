"use client"

import React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Send, Bot, User, AlertCircle, RefreshCw, Copy, Check, Trash2, MessageSquare } from "lucide-react"

// Enhanced sample questions organized by categories
const SAMPLE_QUESTIONS = {
  basics: [
    "كيف أتوضأ بالطريقة الصحيحة؟",
    "ما هي أركان الصلاة؟",
    "كم عدد ركعات كل صلاة؟",
  ],
  times: [
    "متى يبدأ وقت صلاة الظهر؟",
    "متى ينتهي وقت صلاة العصر؟",
    "ما هو وقت صلاة الفجر؟",
  ],
  details: [
    "ما هي واجبات الصلاة؟",
    "ما هي سنن الصلاة؟",
    "ماذا أفعل إذا نسيت ركعة؟",
  ]
}

interface ChatMessage {
  id: string
  type: "user" | "bot"
  content: string
  source?: string
  timestamp: Date
}

// Button Component
const Button = ({ children, className = "", variant = "default", size = "default", disabled = false, onClick, type = "button", ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
  
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
  }
  
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-8 px-3 text-xs",
    lg: "h-11 px-8"
  }
  
  return (
    <button
      type={type}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

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
  <div className={`rounded-xl border bg-card text-card-foreground shadow-sm ${className}`}>
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

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              المساعد الذكي للصلاة
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            اسأل أي سؤال حول الصلاة واحصل على إجابة فورية ودقيقة من الذكاء الاصطناعي المتخصص
          </p>
        </div>

        {/* Service Status */}
        <Card className="mb-6 border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <CardTitle className="text-green-800 dark:text-green-200 text-lg">
                الخدمة متاحة الآن
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-green-700 dark:text-green-300 font-medium">
                🤖 المساعد الذكي جاهز للإجابة على جميع أسئلتك حول الصلاة
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">
                💡 يُرجى التحقق من الإجابات مع العلماء المختصين للتأكد من صحتها
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Sample Questions */}
        {messages.length === 0 && (
          <Card className="mb-6 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Bot className="w-5 h-5 text-green-600" />
                أسئلة مقترحة للبدء
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Category Selector */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {Object.keys(SAMPLE_QUESTIONS).map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    {category === "basics" && "الأساسيات"}
                    {category === "times" && "الأوقات"}
                    {category === "details" && "التفاصيل"}
                  </Button>
                ))}
              </div>
              
              {/* Questions Grid */}
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {SAMPLE_QUESTIONS[selectedCategory].map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-4 text-right justify-start whitespace-normal leading-relaxed hover:bg-green-50 dark:hover:bg-green-950/20 transition-all duration-200"
                    onClick={() => handleSampleQuestion(question)}
                    disabled={loading}
                  >
                    <span className="text-sm">{question}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Chat Interface */}
        <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <Bot className="w-6 h-6 text-green-600" />
              المحادثة
              {messages.length > 0 && (
                <span className="text-sm text-gray-500 font-normal">
                  ({messages.length} رسالة)
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
                مسح المحادثة
              </Button>
            )}
          </CardHeader>

          <CardContent className="p-0">
            {/* Messages Area */}
            <ScrollArea className="h-[500px] md:h-[600px] px-6" ref={scrollAreaRef}>
              <div className="space-y-6 py-4">
                {messages.length === 0 && (
                  <div className="text-center text-gray-500 py-12">
                    <Bot className="w-16 h-16 mx-auto mb-4 text-green-600 opacity-50" />
                    <h3 className="text-xl font-medium mb-2">مرحباً بك! 👋</h3>
                    <p className="text-lg">كيف يمكنني مساعدتك في تعلم الصلاة اليوم؟</p>
                    <p className="text-sm mt-3 text-gray-400">
                      اختر سؤالاً من الأعلى أو اكتب سؤالك المخصص
                    </p>
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
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white" 
                            : "bg-gradient-to-r from-green-500 to-green-600 text-white"
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
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        }`}
                      >
                        {/* Copy Button for Bot Messages */}
                        {message.type === "bot" && message.content.length > 50 && (
                          <button
                            onClick={() => copyToClipboard(message.content, message.id)}
                            className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                            title="نسخ الإجابة"
                          >
                            {copiedId === message.id ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-600" />
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
                        <div className="mt-3 pt-2 border-t border-white/20 dark:border-gray-600/30">
                          {message.source && (
                            <p className="text-xs opacity-75 font-medium mb-1">
                              📚 المصدر: {message.source}
                            </p>
                          )}
                          <p className="text-xs opacity-60">
                            🕐 {message.timestamp.toLocaleTimeString('ar-SA', {
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
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white flex items-center justify-center shadow-md">
                        <Bot className="w-5 h-5" />
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-300">جاري الكتابة...</span>
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
                <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-red-700 dark:text-red-300 font-medium mb-2">حدث خطأ:</p>
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleRetry} 
                    disabled={loading}
                    className="text-red-600 hover:text-red-700 hover:bg-red-100"
                  >
                    <RefreshCw className="w-4 h-4 ml-1" />
                    إعادة المحاولة
                  </Button>
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="border-t bg-gray-50 dark:bg-gray-800/50 p-6 rounded-b-xl">
              <form onSubmit={handleSubmit} className="flex gap-3">
                <div className="flex-1">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="اكتب سؤالك هنا... (مثل: كيف أتوضأ؟ أو ما هي أركان الصلاة؟)"
                    disabled={loading}
                    className="text-base py-3 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400 transition-colors"
                    maxLength={1000}
                    dir="rtl"
                  />
                  {input.length > 800 && (
                    <p className="text-xs text-gray-500 mt-2 text-right">
                      متبقي {1000 - input.length} حرف
                    </p>
                  )}
                </div>
                <Button 
                  type="submit" 
                  disabled={!input.trim() || loading || input.length > 1000} 
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-6 py-3 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  size="lg"
                >
                  {loading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </form>
              
              {/* Quick Actions */}
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                <span className="text-xs text-gray-500">إجراءات سريعة:</span>
                <button
                  onClick={() => handleSampleQuestion("كيف أتوضأ؟")}
                  className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  disabled={loading}
                >
                  الوضوء
                </button>
                <button
                  onClick={() => handleSampleQuestion("ما هي أركان الصلاة؟")}
                  className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  disabled={loading}
                >
                  أركان الصلاة
                </button>
                <button
                  onClick={() => handleSampleQuestion("متى أوقات الصلاة؟")}
                  className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  disabled={loading}
                >
                  أوقات الصلاة
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p className="mb-2">
            🤲 نسأل الله أن ينفعنا وإياكم بما تعلمنا
          </p>
          <p>
            💡 هذا المساعد يقدم معلومات عامة. يُرجى مراجعة العلماء المختصين للفتاوى الخاصة
          </p>
        </div>
      </div>
    </div>
  )
}