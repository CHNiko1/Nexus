import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { db } from '@/lib/db'
import { formatPrice } from '@/lib/utils'
import { ArrowRight, Star, Package, Sparkles } from 'lucide-react'

export const metadata = {
  title: 'Shop - Nexus Store',
  description: 'Browse our premium curated collection of products',
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; sort?: string; search?: string }
}) {
  const { category, sort, search } = searchParams

  const products = await db.product.findMany({
    where: {
      published: true,
      ...(category && { category: { slug: category } }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    },
    include: {
      images: { orderBy: { position: 'asc' }, take: 1 },
      category: true,
    },
    orderBy:
      sort === 'price-asc'
        ? { price: 'asc' }
        : sort === 'price-desc'
        ? { price: 'desc' }
        : { createdAt: 'desc' },
  })

  const categories = await db.category.findMany()

  return (
    <div className="w-full">
      {/* Header with Gradient */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-blue-950/20 border-b">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5MzMzZWEiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDEwYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0xMCAwYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
        <div className="container relative py-16 md:py-20">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border w-fit">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Premium Collection</span>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient-primary">
                Discover {products.length}+ Amazing Products
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Curated items from our global marketplace, handpicked just for you
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-12">
        {/* Filters & Sorting */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span className="h-6 w-1 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></span>
                Filter by Category
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant={!category ? 'default' : 'outline'} 
                  size="lg"
                  className={!category ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg' : 'border-2'}
                  asChild
                >
                  <Link href="/products">
                    All Products ({products.length})
                  </Link>
                </Button>
                {categories.map(cat => {
                  const count = products.filter(p => p.categoryId === cat.id).length
                  return (
                    <Button
                      key={cat.id}
                      variant={category === cat.slug ? 'default' : 'outline'}
                      size="lg"
                      className={category === cat.slug ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg' : 'border-2'}
                      asChild
                    >
                      <Link href={`/products?category=${cat.slug}`}>
                        {cat.name} ({count})
                      </Link>
                    </Button>
                  )
                })}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span className="h-6 w-1 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></span>
                Sort By
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant={!sort || sort === 'new' ? 'default' : 'outline'}
                  size="lg"
                  className={!sort || sort === 'new' ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg' : 'border-2'}
                  asChild
                >
                  <Link href={`/products${category ? `?category=${category}` : ''}`}>
                    Newest First
                  </Link>
                </Button>
                <Button
                  variant={sort === 'price-asc' ? 'default' : 'outline'}
                  size="lg"
                  className={sort === 'price-asc' ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg' : 'border-2'}
                  asChild
                >
                  <Link href={`/products?sort=price-asc${category ? `&category=${category}` : ''}`}>
                    Price: Low to High
                  </Link>
                </Button>
                <Button
                  variant={sort === 'price-desc' ? 'default' : 'outline'}
                  size="lg"
                  className={sort === 'price-desc' ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg' : 'border-2'}
                  asChild
                >
                  <Link href={`/products?sort=price-desc${category ? `&category=${category}` : ''}`}>
                    Price: High to Low
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {products.length === 0 ? (
            <div className="text-center py-20">
              <Package className="h-24 w-24 mx-auto mb-6 text-muted-foreground/30" />
              <p className="text-muted-foreground text-xl mb-6">No products found</p>
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg" asChild>
                <Link href="/products">Browse All Products</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-8">
              {products.map(product => (
                <Link key={product.id} href={`/products/${product.slug}`}>
                  <Card className="group overflow-hidden card-hover border-2 h-full flex flex-col">
                    <CardContent className="p-0 relative aspect-square bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 overflow-hidden">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0].url}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <Package className="h-20 w-20 text-muted-foreground/20" />
                        </div>
                      )}
                      {product.compareAtPrice && (
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg z-10">
                          Sale
                        </div>
                      )}
                      {product.featured && (
                        <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-1 z-10">
                          <Star className="h-3 w-3 fill-current" />
                          Featured
                        </div>
                      )}
                    </CardContent>

                    <div className="p-6 space-y-4 flex-1 flex flex-col">
                      {product.category && (
                        <div className="text-xs font-bold text-primary uppercase tracking-wider">
                          {product.category.name}
                        </div>
                      )}

                      <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors flex-1">
                        {product.name}
                      </h3>

                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                        <span className="text-xs text-muted-foreground ml-2">(4.9)</span>
                      </div>

                      <div className="flex items-baseline gap-3 pt-2 border-t">
                        <span className="text-2xl font-bold text-gradient-primary">
                          {formatPrice(Number(product.price))}
                        </span>
                        {product.compareAtPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(Number(product.compareAtPrice))}
                          </span>
                        )}
                      </div>

                      <Button 
                        className="w-full mt-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg group-hover:shadow-xl transition-all" 
                        size="lg"
                      >
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
