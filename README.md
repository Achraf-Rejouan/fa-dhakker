# فَذَكِّر (fa-dhakker) - Islamic Prayer Learning App

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

## 📖 Overview

**فَذَكِّر** (fa-dhakker) is a comprehensive Islamic prayer learning application that teaches users how to perform the five daily prayers (Salah) step-by-step. The name comes from the Quranic verse meaning "So remind" (فَذَكِّر), emphasizing the app's purpose of reminding and teaching Islamic prayer fundamentals.

### Key Features

- **📚 Step-by-Step Prayer Guide**: Detailed instructions for all five daily prayers (Fajr, Dhuhr, Asr, Maghrib, Isha)
- **🎨 Interactive Visual Demonstrations**: Prayer position illustrations with pose images
- **📖 Islamic References**: Every step backed by Quranic verses and authentic Hadith
- **🌍 Bilingual Support**: Arabic and English with RTL (Right-to-Left) layout support
- **🌙 Dark/Light Mode**: Elegant theme switching with system preference detection
- **📱 Responsive Design**: Mobile-first approach with seamless desktop experience
- **🤖 AI Assistant**: Smart chatbot for prayer-related questions with API integration
- **❓ Comprehensive FAQ**: Detailed answers about prayer rules and common questions
- **✨ Modern UI/UX**: Clean, accessible interface with smooth animations
- **🇵🇸 Cultural Elements**: Palestine flag component showing solidarity

## 🛠️ Technology Stack

### Frontend Framework

- **Next.js 14**: React framework with App Router for modern web development
- **TypeScript**: Type-safe JavaScript for better development experience
- **React 18**: Latest React features with concurrent rendering

### Styling & UI

- **Tailwind CSS v4**: Utility-first CSS framework with custom configuration
- **shadcn/ui**: High-quality, accessible UI components
- **Cairo Font**: Arabic typography support via Google Fonts
- **Lucide React**: Beautiful, customizable icons

### State Management & Data

- **React Context**: Global state management for i18n and theme
- **JSON Data Store**: Structured prayer content with Islamic references
- **Static Site Generation**: Pre-rendered pages for optimal performance
- **Custom Hooks**: Reusable logic for mobile detection and toast notifications

### Development Tools

- **ESLint**: Code linting and quality assurance
- **PostCSS**: CSS processing and optimization
- **pnpm**: Fast, disk space efficient package manager
- **Git**: Version control with automated deployment

### Security & API

- **API Routes**: Backend API integration for chat functionality
- **Security Utils**: Custom security utilities for safe data handling
- **Environment Variables**: Secure configuration management

### Deployment & Hosting

- **Vercel**: Serverless deployment platform

## 🏗️ Project Architecture

### 📂 Directory Structure

```bash
fa-dhakker/
├── 📁 app/                          # Next.js App Router
│   ├── 📄 about/                    # About page
│   │   └── 📄 page.tsx              # About page component
│   ├── 📁 api/                      # API Routes
│   │   └── 📁 chat/                 # Chat API endpoint
│   │       └── 📄 route.ts          # Chat API handler
│   ├── 🤖 chat/                     # AI assistant page
│   │   └── 📄 page.tsx              # Chat interface
│   ├── 📚 content/                  # Prayer content browser
│   │   ├── 📄 loading.tsx           # Loading component
│   │   └── 📄 page.tsx              # Content browser
│   ├── ❓ faq/                       # Frequently asked questions
│   │   ├── 📄 loading.tsx           # FAQ loading state
│   │   └── 📄 page.tsx              # FAQ page
│   ├── 🕌 learn/[prayer]/            # Dynamic prayer learning pages
│   │   └── 📄 page.tsx              # Prayer learning interface
│   ├── 🎨 globals.css               # Global styles and Tailwind config
│   ├── 🧩 layout.tsx                # Root layout with providers
│   └── 🏠 page.tsx                  # Homepage with landing animation
├── 📁 components/                   # Reusable React components
│   ├── 📐 layout/                   # Layout components
│   │   ├── ☰ navbar.tsx             # Navigation with mobile menu
│   │   └── 📎 footer.tsx            # Footer with author credits
│   ├── 🎛️ ui/                       # shadcn/ui components
│   │   ├── ✍️ arabic-logo-animation.tsx  # Landing page animation
│   │   ├── 💡 islamic-quote-popup.tsx    # Inspirational quotes popup
│   │   ├── 🌐 lang-switcher.tsx          # Language toggle
│   │   ├── 🌙 mode-toggle.tsx            # Theme switcher
│   │   ├── 📄 dalil-card.tsx             # Islamic reference cards
│   │   ├── 🏷️ source-badge.tsx          # Source indication badges
│   │   ├── 🇵🇸 palestine-flag.tsx       # Palestine solidarity flag
│   │   └── 🧩 [50+ other components]     # Complete UI component library
│   ├── 🙏 prayer-pose.tsx           # Prayer position component
│   └── 🎨 theme-provider.tsx        # Theme context provider
├── 📜 data/                         # Static JSON data
│   ├── 🕌 contents.arkan.json       # Prayer pillars (أركان الصلاة)
│   ├── 📜 contents.wajibat.json     # Prayer obligations (واجبات الصلاة)
│   ├── ⭐ contents.sunan.json       # Prayer recommendations (سنن الصلاة)
│   ├── 📋 contents.shuroot.json     # Prayer conditions (شروط الصلاة)
│   ├── 🌅 steps.fajr.json           # Fajr prayer steps (2 rakaas, Jahr)
│   ├── ☀️ steps.dhuhr.json          # Dhuhr prayer steps (4 rakaas, Sir)
│   ├── 🌇 steps.asr.json            # Asr prayer steps (4 rakaas, Sir)
│   ├── 🌆 steps.maghrib.json        # Maghrib prayer steps (3 rakaas, Jahr)
│   ├── 🌙 steps.isha.json           # Isha prayer steps (4 rakaas, Jahr/Sir)
│   └── ❓ faq.json                   # FAQ with Islamic references
├── 🪝 hooks/                        # Custom React hooks
│   ├── 📱 use-mobile.ts             # Mobile device detection
│   └── 🍞 use-toast.ts              # Toast notification system
├── ⚙️ lib/                          # Utility libraries
│   ├── 🔌 api.ts                    # Data fetching with fallbacks
│   ├── 🌍 i18n.tsx                  # Internationalization context
│   ├── 🔒 security.ts               # Security utilities
│   └── 🛠️ utils.ts                  # Utility functions (cn, etc.)
├── 📝 types/                        # TypeScript type definitions
│   └── 📑 content.ts                # Prayer content type definitions
├── 🌍 public/                       # Static assets
│   └── 🪨 poses/                    # Prayer position images
│       ├── 🖼️ julus.png             # Sitting position
│       ├── 🖼️ ruku.png              # Bowing position
│       ├── 🖼️ salam.png             # Final greeting
│       ├── 🖼️ standing.png          # Standing position
│       ├── 🖼️ sujud.png             # Prostration position
│       ├── 🖼️ takbir.png            # Opening takbir
│       └── 🖼️ tashahhud.png         # Testimony position
├── 🎨 styles/                       # Additional styles
│   └── 🎨 globals.css               # Global CSS styles
└── 📋 config files                  # Configuration files
    ├── 📄 components.json           # shadcn/ui configuration
    ├── 📄 next.config.mjs           # Next.js configuration
    ├── 📄 package.json              # Dependencies and scripts
    ├── ⚙️ pnpm-lock.yaml            # Package manager lockfile
    ├── 📄 postcss.config.mjs        # PostCSS configuration
    └── 📄 tsconfig.json             # TypeScript configuration
```

### Data Architecture

#### Prayer Steps Structure

Each prayer (Fajr, Dhuhr, Asr, Maghrib, Isha) has detailed step-by-step instructions:

```typescript
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
```

#### Prayer Characteristics

- **Fajr**: 2 rakaas, Jahr (aloud recitation)
- **Dhuhr**: 4 rakaas, Sir (silent recitation)
- **Asr**: 4 rakaas, Sir (silent recitation)
- **Maghrib**: 3 rakaas, Jahr (aloud recitation)
- **Isha**: 4 rakaas, Jahr in first 2 rakaas, Sir in last 2 rakaas

### Component Architecture

#### Core Components

- **Layout Components**: Navbar, Footer with responsive design
- **Prayer Components**: Step-by-step guides with visual demonstrations
- **UI Components**: Comprehensive shadcn/ui component library (50+ components)
- **Theme Provider**: Context-based theme and language management
- **Custom Hooks**: Mobile detection and toast notifications

#### State Management

- **Theme Context**: Dark/light mode with system preference
- **i18n Context**: Arabic/English language switching
- **Custom Hooks**: Reusable stateful logic
- **API Integration**: Backend communication for chat functionality

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, pnpm, or yarn package manager
- Git for version control

### Installation

```bash
# Clone the repository
git clone https://github.com/Achraf-Rejouan/fa-dhakker.git

# Navigate to project directory
cd fa-dhakker

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run development server
npm dev
```

### Environment Variables

Create a `.env` file in the root directory:

```bash
# Add your environment variables here
# (Check .env.example for required variables)
```

## 📱 Usage Guide

### Navigation

- **Homepage**: Landing animation and prayer overview
- **Learn**: Step-by-step prayer guides for each of the five prayers
- **Content**: Browse prayer pillars, obligations, recommendations, and conditions
- **FAQ**: Common questions about Islamic prayer with detailed answers
- **Chat**: AI assistant for prayer-related questions with API backend
- **About**: Information about the app and its purpose

### Features

- **Language Toggle**: Switch between Arabic and English with RTL support
- **Theme Toggle**: Switch between light and dark modes
- **Prayer Positions**: Visual demonstrations with pose images
- **Islamic References**: Detailed citations with source badges
- **Loading States**: Smooth loading experiences for all pages
- **Responsive Design**: Optimized for mobile and desktop
- **AI Chat**: Interactive assistant for prayer-related questions

## 🎨 Design System

### Color Palette

- **Primary**: Green (#16a34a) - Islamic theme
- **Secondary**: Blue (#3b82f6) - Accent color
- **Neutral**: Gray scale for text and backgrounds
- **Success/Error**: Standard semantic colors
- **Palestine Colors**: Red, white, black, green for solidarity

### Typography

- **Arabic**: Cairo font family for proper Arabic rendering
- **English**: Inter font family for clean readability
- **Hierarchy**: Consistent sizing scale with proper line heights

### Components

- **Cards**: Elevated surfaces with subtle shadows
- **Buttons**: Consistent styling with hover states
- **Forms**: Accessible inputs with proper validation
- **Navigation**: Clear hierarchy with active states
- **Badges**: Source indicators and status badges
- **Loading**: Skeleton components for better UX

## 🔧 API Integration

### Chat API

The application includes a chat API endpoint for the AI assistant:

```typescript
// API endpoint: /api/chat
// Method: POST
// Body: { message: string, language: 'ar' | 'en' }
```

### Security

- Environment variable protection
- Input sanitization
- Rate limiting considerations
- Secure API communication

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
- **Performance**: Optimize images and use loading states

### Content Guidelines

- **Islamic Accuracy**: All prayer instructions must be authentic and verified
- **References**: Include proper citations for Quranic verses and Hadith
- **Language**: Maintain respectful and educational tone
- **Accessibility**: Ensure content is accessible to all users
- **Images**: Use appropriate pose images for prayer demonstrations

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
- **Vercel**: Deployment and hosting platform
- **pnpm**: Fast, efficient package manager

### Development

- **Developer**: [REJOUAN Achraf](https://achrafrejouan.vercel.app/)
- **Portfolio**: [achrafrejouan.vercel.app](https://achrafrejouan.vercel.app/)
- **GitHub**: [@Achraf-Rejouan](https://github.com/Achraf-Rejouan)
- **LinkedIn**: [achraf-rejouan](https://www.linkedin.com/in/achraf-rejouan/)

## 📞 Contact

For questions, suggestions, or Islamic content verification:

- **Email**: <achrafrejouan@gmail.com>
- **GitHub Issues**: [Create an issue](https://github.com/Achraf-Rejouan/fa-dhakker/issues)

---

**فَذَكِّر** - *"So remind, for indeed, the reminder benefits the believers"* - Quran 51:55

*Built with ❤️ for the Muslim community*
