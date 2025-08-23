// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!)

// Enhanced prayer-related knowledge base with more comprehensive information
const PRAYER_CONTEXT = `
أنت مساعد ذكي متخصص في تعليم الصلاة الإسلامية والفقه الإسلامي. لديك معرفة شاملة ودقيقة بـ:

## أركان الصلاة السبعة:
1. النية (القصد بالقلب)
2. تكبيرة الإحرام (الله أكبر)
3. قراءة الفاتحة في كل ركعة
4. الركوع مع الطمأنينة
5. الرفع من الركوع مع الاعتدال
6. السجود على الأعضاء السبعة مع الطمأنينة
7. الرفع من السجود مع الجلوس مطمئناً
8. التسليم

## واجبات الصلاة الثمانية:
1. جميع التكبيرات غير تكبيرة الإحرام
2. قول "سمع الله لمن حمده" للإمام والمنفرد
3. قول "ربنا ولك الحمد" للجميع
4. قول "سبحان ربي العظيم" في الركوع
5. قول "سبحان ربي الأعلى" في السجود
6. قول "رب اغفر لي" بين السجدتين
7. التشهد الأول في الصلاة الثلاثية والرباعية
8. الجلوس للتشهد الأول والأخير

## سنن الصلاة:
- دعاء الاستفتاح، الاستعاذة، البسملة، القراءة بعد الفاتحة
- رفع اليدين عند التكبيرات، وضع اليدين على الصدر
- الأذكار والأدعية المسنونة

## شروط صحة الصلاة التسعة:
1. الإسلام
2. العقل
3. التمييز
4. رفع الحدث (الطهارة من الحدث الأصغر والأكبر)
5. إزالة النجاسة من البدن والثوب والمكان
6. ستر العورة
7. دخول الوقت
8. استقبال القبلة
9. النية

## أوقات الصلوات وعدد الركعات:
- الفجر: من طلوع الفجر الثاني حتى طلوع الشمس (2 ركعة)
- الظهر: من زوال الشمس حتى صيرورة ظل الشيء مثله (4 ركعات)
- العصر: من صيرورة ظل الشيء مثله حتى غروب الشمس (4 ركعات)
- المغرب: من غروب الشمس حتى مغيب الشفق الأحمر (3 ركعات)
- العشاء: من مغيب الشفق الأحمر حتى منتصف الليل (4 ركعات)

## أحكام الطهارة:
- الوضوء: فرائضه، سننه، مبطلاته
- الغسل: موجباته، كيفيته
- التيمم: شروطه، كيفيته

تعليمات مهمة للإجابة:
- أجب باللغة العربية الفصحى بأسلوب واضح ومبسط
- نظم المعلومات في نقاط مرقمة أو فقرات واضحة
- اذكر الأدلة الشرعية من القرآن والسنة عند الإمكان
- كن دقيقاً في المعلومات الفقهية وتجنب الخلافات المعقدة
- قدم أمثلة عملية تساعد على الفهم
- إذا كان السؤال خارج نطاق الصلاة، أجب بلطف وأرشد للتخصص
- استخدم تنسيقاً واضحاً مع فصل الفقرات بخطوط فارغة
`

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ChatRequest {
  message: string
  history?: ChatMessage[]
}

interface ChatResponse {
  response: string
  source?: string
  timestamp: string
}

export async function POST(request: NextRequest): Promise<NextResponse<ChatResponse | { error: string }>> {
  try {
    const { message, history = [] }: ChatRequest = await request.json()

    // Validation
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'يرجى إدخال سؤال صحيح' },
        { status: 400 }
      )
    }

    if (message.trim().length > 1000) {
      return NextResponse.json(
        { error: 'السؤال طويل جداً. يرجى تقصيره إلى أقل من 1000 حرف' },
        { status: 400 }
      )
    }

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error('Google Generative AI API key is not configured')
      return NextResponse.json(
        { error: 'خطأ في إعدادات الخدمة. يرجى المحاولة لاحقاً' },
        { status: 500 }
      )
    }

    // Get the generative model with updated configuration
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1024,
      },
    })

    // Build conversation history
    let conversationHistory = ''
    if (history.length > 0) {
      conversationHistory = '\n\nسياق المحادثة السابقة:\n'
      history.slice(-4).forEach((msg, index) => {
        const role = msg.role === 'user' ? 'السائل' : 'المساعد'
        conversationHistory += `${role}: ${msg.content}\n`
      })
    }

    // Create enhanced prompt
    const prompt = `${PRAYER_CONTEXT}

${conversationHistory}

السؤال الحالي: ${message.trim()}

يرجى تقديم إجابة مفيدة ودقيقة باللغة العربية مع مراعاة:
- استخدام تنسيق واضح مع فقرات منفصلة
- ترقيم الخطوات أو النقاط المهمة
- ذكر الأدلة الشرعية المناسبة
- الإيجاز مع الوضوح
- استخدام أمثلة عملية عند الحاجة

الإجابة:`

    // Generate response with timeout
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('انتهت مهلة الاستجابة')), 15000)
    )

    const generatePromise = model.generateContent(prompt)
    
    const result = await Promise.race([generatePromise, timeoutPromise]) as any
    const response = await result.response
    const text = response.text()

    if (!text || text.trim().length === 0) {
      throw new Error('لم يتم الحصول على رد من النموذج')
    }

    // Format response for better readability
    const formattedText = text
      .trim()
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Remove excessive line breaks
      .replace(/^\s*[-*]\s*/gm, '• ') // Convert dashes to bullets
      .replace(/(\d+)[\.\)]\s*/g, '$1. ') // Standardize numbering

    return NextResponse.json({
      response: formattedText,
      source: 'مساعد ذكي متخصص في تعليم الصلاة',
      timestamp: new Date().toISOString()
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    })

  } catch (error) {
    console.error('Chat API error:', error)
    
    // Enhanced error handling with specific Arabic messages
    let errorMessage = 'عذراً، حدث خطأ في الخدمة. يرجى المحاولة لاحقاً'
    let statusCode = 500
    
    if (error instanceof Error) {
      const errorMsg = error.message.toLowerCase()
      
      if (errorMsg.includes('api_key') || errorMsg.includes('key')) {
        errorMessage = 'خطأ في إعدادات الخدمة. يرجى التحقق من الإعدادات'
        statusCode = 500
      } else if (errorMsg.includes('quota') || errorMsg.includes('limit')) {
        errorMessage = 'تم تجاوز حد الاستخدام المسموح. يرجى المحاولة بعد قليل'
        statusCode = 429
      } else if (errorMsg.includes('network') || errorMsg.includes('fetch') || errorMsg.includes('connection')) {
        errorMessage = 'خطأ في الاتصال بالخادم. يرجى التحقق من الإنترنت والمحاولة مرة أخرى'
        statusCode = 503
      } else if (errorMsg.includes('timeout') || errorMsg.includes('انتهت مهلة')) {
        errorMessage = 'انتهت مهلة الاستجابة. يرجى المحاولة مرة أخرى'
        statusCode = 408
      } else if (errorMsg.includes('safety') || errorMsg.includes('policy')) {
        errorMessage = 'عذراً، لا يمكنني الإجابة على هذا السؤال. يرجى إعادة صياغته'
        statusCode = 400
      }
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: statusCode }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'مساعد الصلاة الذكي جاهز للخدمة',
      status: 'active',
      endpoints: {
        chat: 'POST /api/chat',
        health: 'GET /api/chat'
      },
      timestamp: new Date().toISOString()
    },
    { status: 200 }
  )
}