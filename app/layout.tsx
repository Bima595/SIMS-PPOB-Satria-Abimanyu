import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/lib/hooks/use-auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SIMS PPOB",
  description: "SIMS PPOB Dashboard",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
<body className={inter.className} suppressHydrationWarning>
  <AuthProvider>{children}</AuthProvider>
</body>
    </html>
  )
}

