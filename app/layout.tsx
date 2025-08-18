import type React from "react"
import type { Metadata } from "next"
import { Cairo, Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { I18nProvider } from "@/lib/i18n"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Toaster } from "@/components/ui/toaster"
import { IslamicQuotePopup } from "@/components/ui/islamic-quote-popup"

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-cairo",
})

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "فَذَكِّر - تعلم الصلاة خطوة بخطوة",
  description: "شرح مبسّط للصلاة مع أدلته من القرآن والسنّة",
  keywords: ["صلاة", "إسلام", "تعليم", "قرآن", "سنة"],
  authors: [{ name: "REJOUAN Achraf" }],
  openGraph: {
    title: "فَذَكِّر - تعلم الصلاة خطوة بخطوة",
    description: "شرح مبسّط للصلاة مع أدلته من القرآن والسنّة",
    type: "website",
    locale: "ar_SA",
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${cairo.variable} ${inter.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <I18nProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
            <IslamicQuotePopup />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
