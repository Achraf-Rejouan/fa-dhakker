# فَذَكِّر (fa-dhakker) - Islamic Prayer Learning App

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/achraf-rejouans-projects/v0-fa-dhakker)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

## 📖 Overview

**فَذَكِّر** (fa-dhakker) is a comprehensive Islamic prayer learning application that teaches users how to perform the five daily prayers (Salah) step-by-step. The name comes from the Quranic verse meaning "So remind" (فَذَكِّر), emphasizing the app's purpose of reminding and teaching Islamic prayer fundamentals.

### Key Features

- **📚 Step-by-Step Prayer Guide**: Detailed instructions for all five daily prayers (Fajr, Dhuhr, Asr, Maghrib, Isha)
- **🎨 Interactive SVG Animations**: Visual prayer position demonstrations
- **📖 Islamic References**: Every step backed by Quranic verses and authentic Hadith
- **🌍 Bilingual Support**: Arabic and English with RTL (Right-to-Left) layout support
- **🌙 Dark/Light Mode**: Elegant theme switching with system preference detection
- **📱 Responsive Design**: Mobile-first approach with seamless desktop experience
- **🤖 AI Assistant**: Smart chatbot for prayer-related questions (under development)
- **❓ Comprehensive FAQ**: Detailed answers about prayer rules and common questions
- **✨ Modern UI/UX**: Clean, accessible interface with smooth animations

## 🛠️ Technology Stack

### Frontend Framework
- **Next.js 14**: React framework with App Router for modern web development
- **TypeScript**: Type-safe JavaScript for better development experience
- **React 18**: Latest React features with concurrent rendering

### Styling & UI
- **Tailwind CSS v4**: Utility-first CSS framework with custom configuration
- **shadcn/ui**: High-quality, accessible UI components
- **Framer Motion**: Smooth animations and transitions
- **Cairo Font**: Arabic typography support via Google Fonts
- **Lucide React**: Beautiful, customizable icons

### State Management & Data
- **React Context**: Global state management for i18n and theme
- **JSON Data Store**: Structured prayer content with Islamic references
- **Static Site Generation**: Pre-rendered pages for optimal performance

### Development Tools
- **ESLint**: Code linting and quality assurance
- **Prettier**: Code formatting (implied)
- **Git**: Version control with automated v0.app sync

### Deployment & Hosting
- **Vercel**: Serverless deployment platform

## 🏗️ Project Architecture

### Directory Structure

\`\`\`
fa-dhakker/
├── app/                          # Next.js App Router
│   ├── about/                    # About page
│   ├── chat/                     # AI assistant page
│   ├── content/                  # Prayer content browser
│   ├── faq/                      # Frequently asked questions
│   ├── learn/[prayer]/           # Dynamic prayer learning pages
│   ├── globals.css               # Global styles and Tailwind config
│   ├── layout.tsx                # Root layout with providers
│   └── page.tsx                  # Homepage with landing animation
├── components/                   # Reusable React components
│   ├── layout/                   # Layout components
│   │   ├── navbar.tsx            # Navigation with mobile menu
│   │   └── footer.tsx            # Footer with author credits
│   ├── svg/                      # SVG animation components
│   │   └── prayer-pose.tsx       # Animated prayer positions
│   └── ui/                       # shadcn/ui components
│       ├── arabic-logo-animation.tsx  # Landing page animation
│       ├── islamic-quote-popup.tsx    # Inspirational quotes popup
│       ├── lang-switcher.tsx          # Language toggle
│       ├── mode-toggle.tsx            # Theme switcher
│       └── [other-ui-components]      # Various UI components
├── data/                         # Static JSON data
│   ├── contents.arkan.json       # Prayer pillars (أركان الصلاة)
│   ├── contents.wajibat.json     # Prayer obligations (واجبات الصلاة)
│   ├── contents.sunan.json       # Prayer recommendations (سنن الصلاة)
│   ├── contents.shuroot.json     # Prayer conditions (شروط الصلاة)
│   ├── steps.fajr.json           # Fajr prayer steps (2 rakaas, Jahr)
│   ├── steps.dhuhr.json          # Dhuhr prayer steps (4 rakaas, Sir)
│   ├── steps.asr.json            # Asr prayer steps (4 rakaas, Sir)
│   ├── steps.maghrib.json        # Maghrib prayer steps (3 rakaas, Jahr)
│   ├── steps.isha.json           # Isha prayer steps (4 rakaas, Jahr/Sir)
│   └── faq.json                  # FAQ with Islamic references
├── lib/                          # Utility libraries
│   ├── api.ts                    # Data fetching with fallbacks
│   ├── i18n.tsx                  # Internationalization context
│   └── utils.ts                  # Utility functions (cn, etc.)
├── types/                        # TypeScript type definitions
│   └── content.ts                # Prayer content type definitions
└── public/                       # Static assets
    └── images/                   # Image assets
\`\`\`

### Data Architecture

#### Prayer Steps Structure
Each prayer (Fajr, Dhuhr, Asr, Maghrib, Isha) has detailed step-by-step instructions:

\`\`\`typescript
interface PrayerStep {
  id: string                    // Unique identifier
  prayer: string               // Prayer name
  order: number                // Step sequence
  title_ar: string            // Arabic title
  title_en: string            // English title
  description_ar: string      // Arabic description
  description_en: string      // English description
  svgId: string               // Animation identifier
  dalil: DalilReference[]     // Islamic evidence
}

interface DalilReference {
  kind: "quran" | "hadith"    // Source type
  ref: string                 // Reference citation
  text_ar: string            // Arabic text
  text_en: string            // English translation
}
\`\`\`

#### Prayer Characteristics
- **Fajr**: 2 rakaas, Jahr (aloud recitation)
- **Dhuhr**: 4 rakaas, Sir (silent recitation)
- **Asr**: 4 rakaas, Sir (silent recitation)
- **Maghrib**: 3 rakaas, Jahr (aloud recitation)
- **Isha**: 4 rakaas, Jahr in first 2 rakaas, Sir in last 2 rakaas

### Component Architecture

#### Core Components
- **Layout Components**: Navbar, Footer with responsive design
- **Prayer Components**: Step-by-step guides with SVG animations
- **UI Components**: shadcn/ui based with custom Islamic theming
- **Animation Components**: Framer Motion powered transitions

#### State Management
- **Theme Context**: Dark/light mode with system preference
- **i18n Context**: Arabic/English language switching
- **Local State**: Component-level state for interactions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm package manager
- Git for version control

## 📱 Usage Guide

### Navigation
- **Homepage**: Landing animation and prayer overview
- **Learn**: Step-by-step prayer guides for each of the five prayers
- **Content**: Browse prayer pillars, obligations, recommendations, and conditions
- **FAQ**: Common questions about Islamic prayer with detailed answers
- **Chat**: AI assistant for prayer-related questions (under development)
- **About**: Information about the app and its purpose

### Features
- **Language Toggle**: Switch between Arabic and English
- **Theme Toggle**: Switch between light and dark modes
- **Prayer Animations**: Visual demonstrations of prayer positions
- **Islamic References**: Hover over references to see full citations
- **Responsive Design**: Works seamlessly on mobile and desktop

## 🎨 Design System

### Color Palette
- **Primary**: Green (#16a34a) - Islamic theme
- **Secondary**: Blue (#3b82f6) - Accent color
- **Neutral**: Gray scale for text and backgrounds
- **Success/Error**: Standard semantic colors

### Typography
- **Arabic**: Cairo font family for proper Arabic rendering
- **English**: Inter font family for clean readability
- **Hierarchy**: Consistent sizing scale with proper line heights

### Components
- **Cards**: Elevated surfaces with subtle shadows
- **Buttons**: Consistent styling with hover states
- **Forms**: Accessible inputs with proper validation
- **Navigation**: Clear hierarchy with active states

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the coding standards
4. Test your changes thoroughly
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Coding Standards
- **TypeScript**: Use proper typing for all components and functions
- **Components**: Follow React best practices and hooks patterns
- **Styling**: Use Tailwind CSS classes, avoid custom CSS when possible
- **Accessibility**: Ensure WCAG AA compliance
- **Islamic Content**: Verify all religious content with authentic sources

### Content Guidelines
- **Islamic Accuracy**: All prayer instructions must be authentic and verified
- **References**: Include proper citations for Quranic verses and Hadith
- **Language**: Maintain respectful and educational tone
- **Accessibility**: Ensure content is accessible to all users

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

### Islamic Sources
- **Quran**: Primary source for Islamic guidance
- **Sahih Bukhari**: Authentic Hadith collection
- **Sahih Muslim**: Authentic Hadith collection  
- **Abu Dawood**: Hadith collection for prayer details
- **At-Tirmidhi**: Additional Hadith references
- **An-Nasa'i**: Hadith collection for prayer specifics

### Technical Credits
- **Next.js Team**: React framework
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn**: UI component library
- **Framer Motion**: Animation library
- **Vercel**: Deployment and hosting platform

### Development
- **Developer**: [REJOUAN Achraf](https://achrafrejouan.vercel.app/)
- **Portfolio**: [achrafrejouan.vercel.app](https://achrafrejouan.vercel.app/)
- **GitHub**: [@Achraf-Rejouan](https://github.com/Achraf-Rejouan)
- **LinkedIn**: [achraf-rejouan](https://www.linkedin.com/in/achraf-rejouan/)

## 📞 Contact

For questions, suggestions, or Islamic content verification:
- **Email**: achrafrejouan@gmail.com
- **GitHub Issues**: [Create an issue](https://github.com/Achraf-Rejouan/fa-dhakker/issues)

---

**فَذَكِّر** - *"So remind, for indeed, the reminder benefits the believers"* - Quran 51:55

*Built with ❤️ for the Muslim community*
