import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { Sparkles, Mail, MapPin, Phone, Facebook, Twitter, Instagram, Youtube } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Footer() {
  return (
    <footer className="border-t bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <div className="container py-16 md:py-20">
        {/* Newsletter Section */}
        <div className="mb-16 rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-8 md:p-12 text-white">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
              <Mail className="h-4 w-4" />
              <span className="text-sm font-medium">Newsletter</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold">Stay in the Loop</h3>
            <p className="text-white/90 text-lg">
              Subscribe to get special offers, free giveaways, and updates on new arrivals.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 h-12 bg-white/20 border-white/30 text-white placeholder:text-white/60 backdrop-blur-sm rounded-xl"
              />
              <Button size="lg" variant="secondary" className="rounded-xl px-8">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center space-x-3 group">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Nexus
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-sm">
              Your premier destination for quality products at unbeatable prices. Experience excellence in every purchase with fast shipping and exceptional service.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>123 Commerce Street, NY 10001</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>support@nexusstore.com</span>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider">Shop</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="h-1 w-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?featured=true" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="h-1 w-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Featured
                </Link>
              </li>
              <li>
                <Link href="/products?sort=new" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="h-1 w-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/products?sort=price-asc" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="h-1 w-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Best Sellers
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider">Support</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="h-1 w-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="h-1 w-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="h-1 w-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="h-1 w-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="h-1 w-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="h-1 w-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="h-1 w-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            &copy; {new Date().getFullYear()} Nexus Store. All rights reserved. Crafted with ❤️
          </p>
          
          {/* Social Links */}
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" className="rounded-full hover:bg-primary/10 hover:text-primary" asChild>
              <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
            </Button>
            <Button size="icon" variant="ghost" className="rounded-full hover:bg-primary/10 hover:text-primary" asChild>
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </Button>
            <Button size="icon" variant="ghost" className="rounded-full hover:bg-primary/10 hover:text-primary" asChild>
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </Button>
            <Button size="icon" variant="ghost" className="rounded-full hover:bg-primary/10 hover:text-primary" asChild>
              <Link href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </Button>
          </div>

          {/* Payment Methods */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground mr-2">We accept:</span>
            <div className="flex gap-2">
              <div className="text-xs bg-white dark:bg-gray-800 px-2 py-1 rounded font-medium border">Visa</div>
              <div className="text-xs bg-white dark:bg-gray-800 px-2 py-1 rounded font-medium border">Mastercard</div>
              <div className="text-xs bg-blue-600 text-white px-2 py-1 rounded font-medium">PayPal</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
