import * as React from "react"

import { cn } from "@/lib/utils"

// Enhanced Card component with modern styling and improved accessibility
function Card({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground rounded-xl border border-border shadow-sm transition-shadow hover:shadow-md",
        "flex flex-col overflow-hidden",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function CardHeader({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "flex flex-col space-y-1.5 p-6",
        "border-b border-border/50 bg-muted/30",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function CardTitle({ 
  className, 
  children, 
  as: Component = "h3",
  ...props 
}: React.ComponentProps<"div"> & { as?: keyof JSX.IntrinsicElements }) {
  return (
    <Component
      data-slot="card-title"
      className={cn(
        "text-lg font-semibold leading-tight tracking-tight text-card-foreground",
        "flex items-center gap-2",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

function CardDescription({ className, children, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="card-description"
      className={cn(
        "text-sm text-muted-foreground leading-relaxed",
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}

function CardAction({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "absolute top-4 right-4 flex items-center gap-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function CardContent({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        "flex-1 p-6",
        "text-sm leading-relaxed",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function CardFooter({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center justify-between p-6 pt-0",
        "border-t border-border/50 bg-muted/20",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// New specialized card variants for the chat application
function StatusCard({ 
  status = "active", 
  className, 
  children, 
  ...props 
}: React.ComponentProps<"div"> & { status?: "active" | "inactive" | "warning" }) {
  const statusStyles = {
    active: "border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800",
    inactive: "border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800",
    warning: "border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-800"
  }

  return (
    <Card 
      className={cn(statusStyles[status], className)}
      {...props}
    >
      {children}
    </Card>
  )
}

function ChatCard({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <Card
      className={cn(
        "h-[600px] shadow-xl border-0",
        "bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm",
        "flex flex-col",
        className
      )}
      {...props}
    >
      {children}
    </Card>
  )
}

function MessageBubble({ 
  type = "bot", 
  className, 
  children, 
  ...props 
}: React.ComponentProps<"div"> & { type?: "user" | "bot" }) {
  const bubbleStyles = {
    user: "bg-gradient-to-r from-blue-500 to-blue-600 text-white ml-auto",
    bot: "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
  }

  return (
    <div
      className={cn(
        "rounded-2xl p-4 shadow-sm relative group max-w-[85%]",
        "break-words overflow-wrap-anywhere",
        bubbleStyles[type],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Export all components
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
}