import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Shield, Users, Heart } from "lucide-react"

export default function AboutPage() {
  const sources = [
    "القرآن الكريم",
    "صحيح البخاري",
    "صحيح مسلم",
    "سنن أبي داود",
    "سنن الترمذي",
    "سنن النسائي",
    "سنن ابن ماجه",
  ]

  const features = [
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "مصادر موثقة",
      description: "جميع المعلومات مستقاة من القرآن الكريم والسنة النبوية الصحيحة",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "محتوى آمن",
      description: "تم مراجعة المحتوى من قبل متخصصين في الشريعة الإسلامية",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "للجميع",
      description: "مناسب للمبتدئين والمتقدمين في تعلم أحكام الصلاة",
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "مجاني",
      description: "خدمة مجانية بالكامل لوجه الله تعالى",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">حول فَذَكِّر</h1>
        <p className="text-lg text-muted-foreground">منصة تعليمية لتعلم الصلاة وفق الكتاب والسنة</p>
      </div>

      {/* Mission */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>رسالتنا</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="leading-relaxed">
            نهدف إلى تسهيل تعلم الصلاة للمسلمين في جميع أنحاء العالم من خلال منصة تفاعلية تجمع بين البساطة في العرض
            والدقة في المحتوى، مع الاعتماد على المصادر الشرعية الموثقة.
          </p>
          <p className="leading-relaxed">
            نؤمن بأن الصلاة هي عماد الدين، ولذلك نسعى لتقديم محتوى تعليمي عالي الجودة يساعد المسلمين على أداء صلاتهم
            بالطريقة الصحيحة.
          </p>
        </CardContent>
      </Card>

      {/* Features */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {features.map((feature, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center text-green-600">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sources */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>المصادر الشرعية</CardTitle>
          <CardDescription>نعتمد في محتوانا على المصادر الشرعية الموثقة التالية:</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {sources.map((source, index) => (
              <Badge key={index} variant="secondary" className="text-sm">
                {source}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
        <CardHeader>
          <CardTitle className="text-amber-800 dark:text-amber-200">إخلاء مسؤولية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-amber-700 dark:text-amber-300">
            <p>
              المحتوى المقدم في هذه المنصة هو للأغراض التعليمية العامة فقط، وهو مبني على فهمنا للنصوص الشرعية والمصادر
              المعتمدة.
            </p>
            <p>
              للحصول على فتاوى شرعية أو إجابات على مسائل فقهية معقدة، يُرجى الرجوع إلى العلماء المختصين وأهل العلم
              الثقات.
            </p>
            <p>
              نحن نبذل قصارى جهدنا لضمان دقة المعلومات، ولكننا لا نتحمل المسؤولية عن أي أخطاء قد تحدث. نرحب بملاحظاتكم
              وتصحيحاتكم.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <div className="text-center mt-8 pt-8 border-t">
        <p className="text-muted-foreground">
          للتواصل معنا أو الإبلاغ عن أخطاء:
          <a href="mailto:achrafrejouan@gmail.com" className="text-green-600 hover:underline mr-2">
            achrafrejouan@gmail.com
          </a>
        </p>
      </div>
    </div>
  )
}
