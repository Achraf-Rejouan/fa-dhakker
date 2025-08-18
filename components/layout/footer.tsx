'use client';

import { useI18n } from "@/lib/i18n"

export function Footer() {
  const { t } = useI18n()

  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
            <span className="font-semibold text-green-600">فَذَكِّر</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">{t("hero.disclaimer")}</p>
          <div className="text-xs text-muted-foreground">
            <p>v1.0.0 • Built with Next.js & Tailwind CSS</p>
            <p className="mt-1">Sources: Quran, Sahih Bukhari, Sahih Muslim, Abu Dawood</p>
          </div>

          <div className="pt-4 border-t border-muted-foreground/20">
            <p className="text-xs text-muted-foreground mb-2">Developed by</p>
            <p className="font-medium text-sm">REJOUAN Achraf</p>
            <div className="flex items-center justify-center gap-4 mt-2">
              <a
                href="https://achrafrejouan.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-green-600 hover:text-green-700 hover:underline"
              >
                Portfolio
              </a>
              <a
                href="https://github.com/Achraf-Rejouan"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-green-600 hover:text-green-700 hover:underline"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/achraf-rejouan/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-green-600 hover:text-green-700 hover:underline"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
