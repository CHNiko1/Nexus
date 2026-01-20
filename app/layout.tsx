import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'Nexus Store - Curated Global Marketplace',
    template: '%s | Nexus Store',
  },
  description:
    'Discover premium curated products from around the world. Fast shipping, secure checkout, and exceptional service.',
  keywords: ['marketplace', 'online store', 'e-commerce', 'shopping', 'global'],
  authors: [{ name: 'Nexus Store' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nexus-store.com',
    siteName: 'Nexus Store',
    title: 'Nexus Store - Curated Global Marketplace',
    description:
      'Discover premium products from around the world. Fast shipping, secure checkout, and exceptional service.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nexus Store - Curated Global Marketplace',
    description:
      'Discover premium products from around the world. Fast shipping, secure checkout, and exceptional service.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
