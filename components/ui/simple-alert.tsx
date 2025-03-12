import React from "react"

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive"
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className = "", variant = "default", ...props }, ref) => {
    const variantStyles = {
      default: "bg-gray-50 border border-gray-200",
      destructive: "bg-red-50 border border-red-200 text-red-700",
    }

    return (
      <div
        ref={ref}
        role="alert"
        className={`relative w-full rounded-lg p-4 ${variantStyles[variant]} ${className}`}
        {...props}
      />
    )
  },
)

Alert.displayName = "Alert"

interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const AlertDescription = React.forwardRef<HTMLParagraphElement, AlertDescriptionProps>(
  ({ className = "", ...props }, ref) => {
    return <div ref={ref} className={`text-sm ${className}`} {...props} />
  },
)

AlertDescription.displayName = "AlertDescription"

