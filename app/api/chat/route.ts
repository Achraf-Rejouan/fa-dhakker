// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!)

// Enhanced prayer-related knowledge base with multilingual context
const PRAYER_CONTEXT = `
You are an intelligent assistant specialized in Islamic prayer (Salah) and Islamic jurisprudence (Fiqh). You have comprehensive and accurate knowledge of:

## The Seven Pillars of Prayer:
1. Intention (Niyyah - intention in the heart)
2. Takbirat al-Ihram (saying "Allahu Akbar" to start)
3. Reciting Al-Fatiha in every Rak'ah
4. Ruku (bowing) with tranquility
5. Rising from Ruku with straightening
6. Sujud (prostration) on seven body parts with tranquility
7. Rising from Sujud with sitting tranquilly
8. Taslim (saying Salam to end prayer)

## The Eight Obligations of Prayer:
1. All Takbirs except Takbirat al-Ihram
2. Saying "Sami'a Allahu liman hamidah" (for Imam and individual)
3. Saying "Rabbana wa laka al-hamd" (for everyone)
4. Saying "Subhana Rabbi al-Azeem" in Ruku
5. Saying "Subhana Rabbi al-A'la" in Sujud
6. Saying "Rabbi ighfir li" between prostrations
7. First Tashahhud in 3 or 4 Rak'ah prayers
8. Sitting for first and final Tashahhud

## Sunnah Acts of Prayer:
- Opening supplication, seeking refuge, Bismillah, recitation after Al-Fatiha
- Raising hands during Takbirs, placing hands on chest
- Recommended remembrances and supplications

## Nine Conditions for Valid Prayer:
1. Islam
2. Sanity
3. Ability to distinguish
4. Ritual purity (from minor and major impurity)
5. Cleanliness from impurities (body, clothing, place)
6. Covering the Awrah (private parts)
7. Entry of prayer time
8. Facing Qibla
9. Intention

## Prayer Times and Number of Rak'ahs:
- Fajr: From true dawn until sunrise (2 Rak'ahs)
- Dhuhr: From sun's zenith until shadow equals object (4 Rak'ahs)
- Asr: From shadow equals object until sunset (4 Rak'ahs)
- Maghrib: From sunset until red twilight disappears (3 Rak'ahs)
- Isha: From red twilight disappears until midnight (4 Rak'ahs)

## Purification Rules:
- Wudu (ablution): obligations, recommended acts, nullifiers
- Ghusl (ritual bath): requirements, method
- Tayammum (dry ablution): conditions, method

IMPORTANT RESPONSE INSTRUCTIONS:
- ALWAYS respond in the same language as the user's question
- If Arabic: Use clear, classical Arabic with simple style
- If other languages: Use clear, appropriate language for that culture
- Organize information in numbered points or clear paragraphs
- Mention Islamic evidence from Quran and Sunnah when possible
- Be precise in jurisprudential information and avoid complex disputes
- Provide practical examples to aid understanding
- If question is outside prayer scope, politely redirect to specialization
- Use clear formatting with separated paragraphs
- Maintain respectful Islamic etiquette in all languages

Language Detection Guide:
- Arabic: Classical Islamic terminology and Arabic grammar patterns
- English: Islamic terms with English explanations
- French: Islamic terms with French explanations
- Other languages: Adapt accordingly while maintaining Islamic authenticity
`

// Language detection helper
const detectLanguage = (text: string): string => {
  // Arabic detection (including Islamic terms)
  const arabicPattern = /[\u0600-\u06FF\u0750-\u077F]/
  if (arabicPattern.test(text)) {
    return 'arabic'
  }
  
  // French detection
  const frenchWords = ['comment', 'pourquoi', 'quand', 'où', 'que', 'qui', 'quoi', 'combien', 'prière', 'islam', 'salat']
  const frenchPattern = /[àâäéèêëïîôùûüÿç]/i
  if (frenchPattern.test(text) || frenchWords.some(word => text.toLowerCase().includes(word))) {
    return 'french'
  }
  
  // Spanish detection
  const spanishWords = ['cómo', 'por qué', 'cuándo', 'dónde', 'qué', 'quién', 'cuánto', 'oración', 'islam', 'salat']
  const spanishPattern = /[áéíóúñü]/i
  if (spanishPattern.test(text) || spanishWords.some(word => text.toLowerCase().includes(word))) {
    return 'spanish'
  }
  
  // German detection
  const germanWords = ['wie', 'warum', 'wann', 'wo', 'was', 'wer', 'wieviel', 'gebet', 'islam']
  const germanPattern = /[äöüß]/i
  if (germanPattern.test(text) || germanWords.some(word => text.toLowerCase().includes(word))) {
    return 'german'
  }
  
  // Default to English
  return 'english'
}

// Get language-specific instructions
const getLanguageInstructions = (language: string): string => {
  const instructions = {
    arabic: `
أجب باللغة العربية الفصحى بأسلوب واضح ومبسط:
- نظم المعلومات في نقاط مرقمة أو فقرات واضحة
- اذكر الأدلة الشرعية من القرآن والسنة عند الإمكان
- كن دقيقاً في المعلومات الفقهية وتجنب الخلافات المعقدة
- قدم أمثلة عملية تساعد على الفهم
- استخدم تنسيقاً واضحاً مع فصل الفقرات بخطوط فارغة
`,
    english: `
Please respond in clear English:
- Organize information in numbered points or clear paragraphs
- Include Islamic evidence from Quran and Sunnah when appropriate
- Be precise in jurisprudential information and avoid complex disputes
- Provide practical examples to aid understanding
- Use clear formatting with separated paragraphs
`,
    french: `
Veuillez répondre en français clair:
- Organisez les informations en points numérotés ou paragraphes clairs
- Incluez les preuves islamiques du Coran et de la Sunnah si approprié
- Soyez précis dans les informations jurisprudentielles et évitez les disputes complexes
- Fournissez des exemples pratiques pour aider à la compréhension
- Utilisez un formatage clair avec des paragraphes séparés
`,
    spanish: `
Por favor responde en español claro:
- Organiza la información en puntos numerados o párrafos claros
- Incluye evidencia islámica del Corán y la Sunnah cuando sea apropiado
- Sé preciso en la información jurisprudencial y evita disputas complejas
- Proporciona ejemplos prácticos para ayudar a la comprensión
- Usa formato claro con párrafos separados
`,
    german: `
Bitte antworte auf klarem Deutsch:
- Organisiere Informationen in nummerierten Punkten oder klaren Absätzen
- Füge islamische Beweise aus Koran und Sunnah hinzu, wenn angemessen
- Sei präzise in juristischen Informationen und vermeide komplexe Streitigkeiten
- Gib praktische Beispiele zur Verständnishilfe
- Verwende klare Formatierung mit getrennten Absätzen
`
  }
  
  return instructions[language as keyof typeof instructions] || instructions.english
}

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
  detectedLanguage?: string
}

export async function POST(request: NextRequest): Promise<NextResponse<ChatResponse | { error: string }>> {
  try {
    const { message, history = [] }: ChatRequest = await request.json()

    // Validation
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Please enter a valid question / يرجى إدخال سؤال صحيح' },
        { status: 400 }
      )
    }

    if (message.trim().length > 1000) {
      return NextResponse.json(
        { error: 'Question is too long. Please shorten it to less than 1000 characters / السؤال طويل جداً. يرجى تقصيره إلى أقل من 1000 حرف' },
        { status: 400 }
      )
    }

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error('Google Generative AI API key is not configured')
      return NextResponse.json(
        { error: 'Service configuration error. Please try again later / خطأ في إعدادات الخدمة. يرجى المحاولة لاحقاً' },
        { status: 500 }
      )
    }

    // Detect language
    const detectedLanguage = detectLanguage(message.trim())
    console.log('Detected language:', detectedLanguage)

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
      const historyLabel = {
        arabic: 'سياق المحادثة السابقة:',
        english: 'Previous conversation context:',
        french: 'Contexte de conversation précédente:',
        spanish: 'Contexto de conversación anterior:',
        german: 'Vorheriger Gesprächskontext:'
      }
      
      conversationHistory = `\n\n${historyLabel[detectedLanguage as keyof typeof historyLabel] || historyLabel.english}\n`
      history.slice(-4).forEach((msg, index) => {
        const roleLabels = {
          arabic: { user: 'السائل', assistant: 'المساعد' },
          english: { user: 'User', assistant: 'Assistant' },
          french: { user: 'Utilisateur', assistant: 'Assistant' },
          spanish: { user: 'Usuario', assistant: 'Asistente' },
          german: { user: 'Benutzer', assistant: 'Assistent' }
        }
        
        const roles = roleLabels[detectedLanguage as keyof typeof roleLabels] || roleLabels.english
        const role = msg.role === 'user' ? roles.user : roles.assistant
        conversationHistory += `${role}: ${msg.content}\n`
      })
    }

    // Get language-specific instructions
    const languageInstructions = getLanguageInstructions(detectedLanguage)
    
    // Create the current question label
    const questionLabels = {
      arabic: 'السؤال الحالي:',
      english: 'Current question:',
      french: 'Question actuelle:',
      spanish: 'Pregunta actual:',
      german: 'Aktuelle Frage:'
    }
    
    const questionLabel = questionLabels[detectedLanguage as keyof typeof questionLabels] || questionLabels.english

    // Create enhanced prompt
    const prompt = `${PRAYER_CONTEXT}

${conversationHistory}

${questionLabel} ${message.trim()}

${languageInstructions}

Response:`

    // Generate response with timeout
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout / انتهت مهلة الاستجابة')), 15000)
    )

    const generatePromise = model.generateContent(prompt)
    
    const result = await Promise.race([generatePromise, timeoutPromise]) as any
    const response = await result.response
    const text = response.text()

    if (!text || text.trim().length === 0) {
      throw new Error('No response received from model / لم يتم الحصول على رد من النموذج')
    }

    // Format response for better readability
    const formattedText = text
      .trim()
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Remove excessive line breaks
      .replace(/^\s*[-*]\s*/gm, '• ') // Convert dashes to bullets
      .replace(/(\d+)[\.\)]\s*/g, '$1. ') // Standardize numbering

    // Source labels for different languages
    const sourceLabels = {
      arabic: 'مساعد ذكي متخصص في تعليم الصلاة',
      english: 'Intelligent Assistant Specialized in Prayer Education',
      french: 'Assistant Intelligent Spécialisé dans l\'Éducation de la Prière',
      spanish: 'Asistente Inteligente Especializado en Educación de la Oración',
      german: 'Intelligenter Assistent Spezialisiert auf Gebetserziehung'
    }

    return NextResponse.json({
      response: formattedText,
      source: sourceLabels[detectedLanguage as keyof typeof sourceLabels] || sourceLabels.english,
      timestamp: new Date().toISOString(),
      detectedLanguage
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    })

  } catch (error) {
    console.error('Chat API error:', error)
    
    // Enhanced error handling with multilingual messages
    const errorMessages = {
      service: {
        arabic: 'خطأ في إعدادات الخدمة. يرجى التحقق من الإعدادات',
        english: 'Service configuration error. Please check settings',
        french: 'Erreur de configuration du service. Veuillez vérifier les paramètres',
        spanish: 'Error de configuración del servicio. Por favor verificar la configuración',
        german: 'Service-Konfigurationsfehler. Bitte Einstellungen überprüfen'
      },
      quota: {
        arabic: 'تم تجاوز حد الاستخدام المسموح. يرجى المحاولة بعد قليل',
        english: 'Usage limit exceeded. Please try again later',
        french: 'Limite d\'utilisation dépassée. Veuillez réessayer plus tard',
        spanish: 'Límite de uso excedido. Por favor intenta de nuevo más tarde',
        german: 'Nutzungsgrenze überschritten. Bitte später erneut versuchen'
      },
      network: {
        arabic: 'خطأ في الاتصال بالخادم. يرجى التحقق من الإنترنت والمحاولة مرة أخرى',
        english: 'Server connection error. Please check internet and try again',
        french: 'Erreur de connexion au serveur. Veuillez vérifier internet et réessayer',
        spanish: 'Error de conexión al servidor. Por favor verifica internet e intenta de nuevo',
        german: 'Server-Verbindungsfehler. Bitte Internet prüfen und erneut versuchen'
      },
      timeout: {
        arabic: 'انتهت مهلة الاستجابة. يرجى المحاولة مرة أخرى',
        english: 'Response timeout. Please try again',
        french: 'Délai de réponse expiré. Veuillez réessayer',
        spanish: 'Tiempo de respuesta agotado. Por favor intenta de nuevo',
        german: 'Antwort-Timeout. Bitte erneut versuchen'
      },
      default: {
        arabic: 'عذراً، حدث خطأ في الخدمة. يرجى المحاولة لاحقاً',
        english: 'Sorry, a service error occurred. Please try again later',
        french: 'Désolé, une erreur de service s\'est produite. Veuillez réessayer plus tard',
        spanish: 'Lo siento, ocurrió un error de servicio. Por favor intenta más tarde',
        german: 'Entschuldigung, ein Service-Fehler ist aufgetreten. Bitte später erneut versuchen'
      }
    }
    
    let errorType = 'default'
    let statusCode = 500
    
    if (error instanceof Error) {
      const errorMsg = error.message.toLowerCase()
      
      if (errorMsg.includes('api_key') || errorMsg.includes('key')) {
        errorType = 'service'
        statusCode = 500
      } else if (errorMsg.includes('quota') || errorMsg.includes('limit')) {
        errorType = 'quota'
        statusCode = 429
      } else if (errorMsg.includes('network') || errorMsg.includes('fetch') || errorMsg.includes('connection')) {
        errorType = 'network'
        statusCode = 503
      } else if (errorMsg.includes('timeout')) {
        errorType = 'timeout'
        statusCode = 408
      }
    }

    // Return error in multiple languages
    const errorMsg = errorMessages[errorType as keyof typeof errorMessages]
    const multilingualError = `${errorMsg.english} / ${errorMsg.arabic}`

    return NextResponse.json(
      { 
        error: multilingualError,
        timestamp: new Date().toISOString()
      },
      { status: statusCode }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'Multilingual Prayer Assistant is ready / مساعد الصلاة متعدد اللغات جاهز للخدمة',
      status: 'active',
      supportedLanguages: ['Arabic', 'English', 'French', 'Spanish', 'German'],
      endpoints: {
        chat: 'POST /api/chat',
        health: 'GET /api/chat'
      },
      timestamp: new Date().toISOString()
    },
    { status: 200 }
  )
}