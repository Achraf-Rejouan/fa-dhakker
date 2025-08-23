import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Card variants using class-variance-authority for better type safety and consistency
const cardVariants = cva(
  "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border shadow-sm transition-all duration-200 word-break",
  {
    variants: {
      variant: {
        default: "py-6",
        elevated: "py-6 shadow-lg hover:shadow-xl",
        outlined: "py-6 border-2",
        ghost: "py-6 border-transparent shadow-none bg-transparent",
        gradient: "py-6 bg-gradient-to-br from-background to-muted/50"
      },
      size: {
        sm: "p-3 gap-3 text-sm",
        default: "py-6 gap-6",
        lg: "py-8 gap-8 text-lg"
      },
      interactive: {
        true: "cursor-pointer hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        false: ""
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      interactive: false
    }
  }
)

const statusCardVariants = cva(
  "transition-all duration-300 animate-in fade-in-0 slide-in-from-bottom-2",
  {
    variants: {
      status: {
        active: "border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800",
        inactive: "border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800",
        warning: "border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-800",
        info: "border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800",
        neutral: "border-gray-200 bg-gray-50 dark:bg-gray-950/20 dark:border-gray-800"
      },
      pulse: {
        true: "animate-pulse",
        false: ""
      }
    },
    defaultVariants: {
      status: "active",
      pulse: false
    }
  }
)

const messageBubbleVariants = cva(
  "rounded-2xl p-4 shadow-sm relative group max-w-[85%] transition-all duration-200 break-words overflow-wrap-anywhere animate-in fade-in-0 slide-in-from-bottom-2",
  {
    variants: {
      type: {
        user: "bg-gradient-to-r from-blue-500 to-blue-600 text-white ml-auto",
        bot: "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100",
        system: "bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 mx-auto text-center text-sm",
        error: "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800"
      },
      size: {
        sm: "p-2 text-sm max-w-[70%]",
        default: "p-4 max-w-[85%]",
        lg: "p-6 text-lg max-w-[90%]"
      },
      animated: {
        true: "hover:scale-[1.02] hover:shadow-md",
        false: ""
      }
    },
    defaultVariants: {
      type: "bot",
      size: "default",
      animated: false
    }
  }
)

interface StatusCardProps 
  extends React.ComponentProps<"div">, 
         VariantProps<typeof statusCardVariants> {
  icon?: React.ReactNode
  title?: string
  description?: string
}

function StatusCard({ 
  status = "active",
  pulse = false,
  className, 
  children,
  icon,
  title,
  description,
  ...props 
}: StatusCardProps) {
  return (
    <Card 
      className={cn(statusCardVariants({ status, pulse }), className)}
      role="status"
      aria-live="polite"
      {...props}
    >
      {(icon || title || description) && (
        <CardHeader>
          <div className="flex items-center gap-3">
            {icon && <div className="shrink-0">{icon}</div>}
            <div className="flex-1">
              {title && <CardTitle className="text-sm font-medium">{title}</CardTitle>}
              {description && <CardDescription className="text-xs mt-1">{description}</CardDescription>}
            </div>
          </div>
        </CardHeader>
      )}
      {children && <CardContent>{children}</CardContent>}
    </Card>
  )
}

interface ChatCardProps extends React.ComponentProps<"div"> {
  isLoading?: boolean
  headerContent?: React.ReactNode
  footerContent?: React.ReactNode
}

function ChatCard({ 
  className, 
  children, 
  isLoading,
  headerContent,
  footerContent,
  ...props 
}: ChatCardProps) {
  return (
    <Card
      className={cn(
        "h-[600px] shadow-xl border-0 relative overflow-hidden",
        "bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm",
        "flex flex-col",
        isLoading && "pointer-events-none",
        className
      )}
      role="main"
      aria-label="Chat interface"
      {...props}
    >
      {headerContent && (
        <CardHeader className="border-b bg-background/50 backdrop-blur-sm">
          {headerContent}
        </CardHeader>
      )}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
      
      {footerContent && (
        <CardFooter className="border-t bg-background/50 backdrop-blur-sm">
          {footerContent}
        </CardFooter>
      )}
      
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Loading...</span>
          </div>
        </div>
      )}
    </Card>
  )
}

interface MessageBubbleProps 
  extends React.ComponentProps<"div">, 
         VariantProps<typeof messageBubbleVariants> {
  timestamp?: Date | string
  avatar?: React.ReactNode
  actions?: React.ReactNode
  isTyping?: boolean
}

function MessageBubble({ 
  type = "bot",
  size = "default",
  animated = false,
  className, 
  children,
  timestamp,
  avatar,
  actions,
  isTyping,
  ...props 
}: MessageBubbleProps) {
  const formattedTimestamp = React.useMemo(() => {
    if (!timestamp) return null
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }, [timestamp])

  return (
    <div className={cn("flex items-end gap-2 group", type === "user" ? "flex-row-reverse" : "flex-row")}>
      {avatar && (
        <div className="shrink-0 w-8 h-8 rounded-full overflow-hidden bg-muted flex items-center justify-center">
          {avatar}
        </div>
      )}
      
      <div className="flex flex-col gap-1 flex-1">
        <div
          className={cn(messageBubbleVariants({ type, size, animated }), className)}
          role="article"
          aria-label={`Message from ${type === "user" ? "user" : "assistant"}`}
          {...props}
        >
          {isTyping ? (
            <div className="flex items-center gap-1">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
              </div>
              <span className="ml-2 text-sm opacity-70">Typing...</span>
            </div>
          ) : (
            children
          )}
          
          {actions && (
            <div className="absolute -bottom-8 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex items-center gap-1 bg-background border rounded-lg p-1 shadow-sm">
                {actions}
              </div>
            </div>
          )}
        </div>
        
        {timestamp && (
          <div className={cn(
            "text-xs text-muted-foreground px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
            type === "user" ? "text-right" : "text-left"
          )}>
            {formattedTimestamp}
          </div>
        )}
      </div>
    </div>
  )
}

interface CardProps 
  extends React.ComponentProps<"div">, 
         VariantProps<typeof cardVariants> {}

function Card({ 
  variant = "default",
  size = "default",
  interactive = false,
  className, 
  onClick,
  ...props 
}: CardProps) {
  const Component = interactive || onClick ? "button" : "div"
  
  return (
    <Component
      data-slot="card"
      className={cn(cardVariants({ variant, size, interactive: interactive || !!onClick }), className)}
      onClick={onClick}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

interface CardTitleProps extends React.ComponentProps<"div"> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div"
}

function CardTitle({ as: Component = "div", className, ...props }: CardTitleProps) {
  return (
    <Component
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm leading-relaxed", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        "flex-1 text-wrap px-6",
        className
      )}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

// Additional utility components
interface LoadingCardProps extends React.ComponentProps<"div"> {
  lines?: number
}

function LoadingCard({ lines = 3, className, ...props }: LoadingCardProps) {
  return (
    <Card className={cn("animate-pulse", className)} {...props}>
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-4 bg-muted rounded",
                i === lines - 1 ? "w-3/4" : "w-full"
              )}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface StatCardProps extends React.ComponentProps<"div"> {
  title: string
  value: string | number
  change?: string
  trend?: "up" | "down" | "neutral"
  icon?: React.ReactNode
}

function StatCard({ 
  title, 
  value, 
  change, 
  trend = "neutral", 
  icon, 
  className, 
  ...props 
}: StatCardProps) {
  const trendColors = {
    up: "text-green-600 dark:text-green-400",
    down: "text-red-600 dark:text-red-400",
    neutral: "text-muted-foreground"
  }

  return (
    <Card variant="elevated" className={cn("", className)} {...props}>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardDescription>{title}</CardDescription>
            <div className="text-2xl font-bold">{value}</div>
            {change && (
              <div className={cn("text-sm font-medium", trendColors[trend])}>
                {change}
              </div>
            )}
          </div>
          {icon && (
            <div className="text-muted-foreground">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  StatusCard,
  ChatCard,
  MessageBubble,
  LoadingCard,
  StatCard,
  cardVariants,
  statusCardVariants,
  messageBubbleVariants,
  type CardProps,
  type StatusCardProps,
  type ChatCardProps,
  type MessageBubbleProps,
}