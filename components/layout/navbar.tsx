"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LangSwitcher } from "@/components/ui/lang-switcher"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { useI18n } from "@/lib/i18n"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { PalestineFlag } from "@/components/ui/palestine-flag"

export function Navbar() {
  const { t } = useI18n()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { href: "/", label: t("nav.home") },
    { href: "/learn/fajr", label: t("nav.learn") },
    { href: "/content", label: t("nav.content") },
    { href: "/faq", label: t("nav.faq") },
    { href: "/chat", label: t("nav.chat") },
    { href: "/about", label: t("nav.about") },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo with Palestine Flag */}
          <Link href="/" className="flex items-center space-x-2 rtl:space-x-reverse">
            <PalestineFlag />
            <span className="font-bold text-xl text-green-600 font-arabic">فَذَكِّر</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 rtl:gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-all duration-200 hover:text-green-600 hover:scale-105 px-3 py-2 rounded-md ${
                  pathname === item.href ? "text-green-600 bg-green-50 dark:bg-green-950" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <LangSwitcher />
            <ModeToggle />

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4 animate-fade-in">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-green-600 px-3 py-2 rounded-md ${
                    pathname === item.href ? "text-green-600 bg-green-50 dark:bg-green-950" : "text-muted-foreground"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
