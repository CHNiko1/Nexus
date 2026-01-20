import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Shield, Truck, DollarSign, Star, Sparkles, TrendingUp, Zap, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { db } from '@/lib/db'
import { formatPrice } from '@/lib/utils'

export default async function HomePage() {
  const featuredProducts = await db.product.findMany({
    where: {
      featured: true,
      published: true,
    },
    include: {
      images: {
        orderBy: {
          position: 'asc',
        },
        take: 1,
      },
      category: true,
    },
    take: 6,
  })

  const categories = await db.category.findMany({
    take: 4,
  })

  return (
    <div className="flex flex-col">
      {/* Hero Section with Gradient Background */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-blue-950/20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{animationDelay: '4s'}}></div>
        </div>

        <div className="container relative py-24 md:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="flex flex-col justify-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border w-fit">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">New Collection Available</span>
              </div>
              
              <div className="space-y-6">
                <h1 className="text-5xl font-bold tracking-tight sm:text-6xl xl:text-7xl leading-tight">
                  Discover Your
                  <span className="block text-gradient-primary">Perfect Style</span>
                </h1>
                <p className="max-w-[600px] text-lg md:text-xl text-muted-foreground leading-relaxed">
                  Shop premium products with <span className="font-semibold text-foreground">free shipping</span> on orders over $50. Experience quality that exceeds expectations.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/50" asChild>
                  <Link href="/products">
                    Shop Collection
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 backdrop-blur-sm bg-white/50 dark:bg-gray-900/50" asChild>
                  <Link href="/products?featured=true">
                    View Featured
                    <Star className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t">
                <div>
                  <div className="text-3xl font-bold text-gradient-primary">10K+</div>
                  <div className="text-sm text-muted-foreground">Happy Customers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gradient-primary">500+</div>
                  <div className="text-sm text-muted-foreground">Products</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gradient-primary">4.9★</div>
                  <div className="text-sm text-muted-foreground">Rating</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=800&fit=crop"
                  alt="Shopping"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 glass rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-lg">Free Shipping</div>
                    <div className="text-sm text-muted-foreground">On orders $50+</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Shop by Category</h2>
          <p className="text-lg text-muted-foreground">Explore our curated collections</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link key={category.id} href={`/products?category=${category.slug}`}>
              <Card className="group overflow-hidden card-hover border-2">
                <CardContent className="p-0">
                  <div className="relative h-64 overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20">
                    {category.image && (
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                      <p className="text-sm opacity-90">{category.description}</p>
                      <Button variant="secondary" size="sm" className="mt-4">
                        Explore <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/10 dark:to-pink-950/10 py-20">
        <div className="container">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-2 card-hover">
              <CardContent className="flex flex-col items-center space-y-4 p-8 text-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Truck className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-xl">Fast Shipping</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Free shipping on orders over $50. Get your products delivered in 2-5 business days.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 card-hover">
              <CardContent className="flex flex-col items-center space-y-4 p-8 text-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-xl">Secure Payments</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  SSL encrypted checkout with support for all major payment methods.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 card-hover">
              <CardContent className="flex flex-col items-center space-y-4 p-8 text-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <DollarSign className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-xl">Best Prices</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Competitive pricing with regular sales and exclusive member discounts.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 card-hover">
              <CardContent className="flex flex-col items-center space-y-4 p-8 text-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-xl">Top Quality</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Carefully curated products that meet our strict quality standards.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Manager Section */}
      <section className="container py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Meet Our Manager</h2>
          <p className="text-lg text-muted-foreground">Leading our team with passion and expertise</p>
        </div>
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 card-hover overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div className="relative aspect-square md:aspect-auto md:h-full min-h-[400px] overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20">
                  <Image
                    src="/manager.jpg"
                    alt="Our Manager - Ikakuna"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="p-8 space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 border w-fit">
                    <Star className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">Store Manager</span>
                  </div>
                  <h3 className="text-3xl font-bold">Ikakuna</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    With years of experience in e-commerce and customer service, our manager ensures every shopping experience exceeds expectations. Dedicated to bringing you the best products and service.
                  </p>
                  <div className="flex gap-2 pt-4">
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold">4.9 Rating</span>
                    </div>
                    <span className="text-muted-foreground">•</span>
                    <div className="text-sm text-muted-foreground">10K+ Happy Customers</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container py-20">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-primary uppercase tracking-wide">Trending Now</span>
            </div>
            <h2 className="text-4xl font-bold tracking-tight mb-2">Featured Products</h2>
            <p className="text-lg text-muted-foreground">Handpicked favorites just for you</p>
          </div>
          <Button size="lg" variant="outline" className="hidden md:flex" asChild>
            <Link href="/products?featured=true">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product: any) => (
            <Link key={product.id} href={`/products/${product.slug}`}>
              <Card className="group overflow-hidden border-2 card-hover h-full flex flex-col">
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20">
                  {product.images[0] ? (
                    <Image
                      src={product.images[0].url}
                      alt={product.images[0].alt || product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-16 w-16 text-muted-foreground/30" />
                    </div>
                  )}
                  {product.compareAtPrice && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
                      Sale
                    </div>
                  )}
                  {product.featured && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      Featured
                    </div>
                  )}
                </div>
                <CardContent className="p-6 flex-1 flex flex-col">
                  {product.category && (
                    <div className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">
                      {product.category.name}
                    </div>
                  )}
                  <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-gradient-primary">
                        {formatPrice(Number(product.price))}
                      </span>
                      {product.compareAtPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(Number(product.compareAtPrice))}
                        </span>
                      )}
                    </div>
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-12 md:hidden">
          <Button size="lg" variant="outline" asChild>
            <Link href="/products?featured=true">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAgMTBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTEwIDBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10"></div>
        <div className="container relative py-20">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Ready to Start Shopping?
            </h2>
            <p className="text-xl text-white/90">
              Join thousands of satisfied customers and discover quality products at unbeatable prices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
                <Link href="/products">
                  Browse Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/10 hover:bg-white/20 border-white/30 text-white" asChild>
                <Link href="/register">
                  Create Account
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
