// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!)

// Prayer-related knowledge base
const PRAYER_CONTEXT = `
أنت مساعد ذكي متخصص في تعليم الصلاة الإسلامية. لديك معرفة شاملة بـ:

1. أركان الصلاة السبعة:
   - النية، تكبيرة الإحرام، قراءة الفاتحة، الركوع، السجود، الجلوس بين السجدتين، التسليم

2. واجبات الصلاة الثمانية:
   - التكبيرات الانتقال، التسميع، التحميد، التشهد الأول والأخير، الصلاة على النبي، الجلوس للتشهد

3. سنن الصلاة:
   - دعاء الاستفتاح، الاستعاذة، البسملة، القراءة بعد الفاتحة، الأذكار

4. شروط صحة الصلاة:
   - الطهارة، ستر العورة، استقبال القبلة، دخول الوقت، العقل والتمييز

5. أوقات الصلوات الخمس وعدد ركعاتها:
   - الفجر (2)، الظهر (4)، العصر (4)، المغرب (3)، العشاء (4)

6. أحكام الطهارة: الوضوء، الغسل، التيمم

تعليمات الإجابة:
- أجب باللغة العربية الفصحى بأسلوب بسيط وواضح
- نظم الإجابة في فقرات قصيرة ومرقمة عند الحاجة
- اذكر الدليل الشرعي عند الإمكان
- كن دقيقاً في المعلومات الفقهية
- استخدم أمثلة عملية عند الحاجة
`

interface ChatRequest {
  message: string
}

interface ChatResponse {
  response: string
  source?: string
}

export async function POST(request: NextRequest): Promise<NextResponse<ChatResponse | { error: string }>> {
  try {
    const { message }: ChatRequest = await request.json()

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'رسالة غير صالحة' },
        { status: 400 }
      )
    }

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json(
        { error: 'مفتاح API غير مُعرَّف' },
        { status: 500 }
      )
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    // Create the prompt with context
    const prompt = `${PRAYER_CONTEXT}

السؤال: ${message.trim()}

يرجى تقديم إجابة مفيدة ودقيقة باللغة العربية مع تنظيم الإجابة بشكل واضح:
- استخدم فقرات منفصلة للنقاط المختلفة
- رقم الخطوات إذا كانت الإجابة تتضمن خطوات متتالية
- اجعل الإجابة مختصرة ومفيدة
- استخدم التنسيق المناسب للقراءة السهلة`

    // Generate response
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    if (!text) {
      throw new Error('لم يتم الحصول على رد من النموذج')
    }

    return NextResponse.json({
      response: text.trim(),
      source: 'Google Gemini AI - متخصص في تعليم الصلاة'
    })

  } catch (error) {
    console.error('Chat API error:', error)
    
    // Return Arabic error message
    let errorMessage = 'عذراً، حدث خطأ في الخدمة. يرجى المحاولة لاحقاً.'
    
    if (error instanceof Error) {
      if (error.message.includes('API_KEY')) {
        errorMessage = 'خطأ في إعدادات الخدمة. يرجى التحقق من مفتاح API.'
      } else if (error.message.includes('quota') || error.message.includes('limit')) {
        errorMessage = 'تم تجاوز حد الاستخدام. يرجى المحاولة لاحقاً.'
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = 'خطأ في الاتصال. يرجى التحقق من الإنترنت والمحاولة مرة أخرى.'
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Chat API is working. Use POST to send messages.' },
    { status: 200 }
  )
}