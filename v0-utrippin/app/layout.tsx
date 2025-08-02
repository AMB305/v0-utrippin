import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { QueryProvider } from "@/components/query-provider"
import { SupabaseProvider } from "@/components/supabase-provider"
import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Utrippin - AI-Powered Travel Planning",
  description: "Discover amazing destinations and plan your perfect trip with AI-powered recommendations.",
  keywords: "travel, AI, trip planning, destinations, hotels, flights",
  authors: [{ name: "Utrippin Team" }],
  openGraph: {
    title: "Utrippin - AI-Powered Travel Planning",
    description: "Discover amazing destinations and plan your perfect trip with AI-powered recommendations.",
    url: "https://utrippin.com",
    siteName: "Utrippin",
    images: [
      {
        url: "/social-card.jpg",
        width: 1200,
        height: 630,
        alt: "Utrippin - AI-Powered Travel Planning",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Utrippin - AI-Powered Travel Planning",
    description: "Discover amazing destinations and plan your perfect trip with AI-powered recommendations.",
    images: ["/social-card.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <SupabaseProvider>
            <AuthProvider>
              <QueryProvider>
                {children}
                <Toaster />
              </QueryProvider>
            </AuthProvider>
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
