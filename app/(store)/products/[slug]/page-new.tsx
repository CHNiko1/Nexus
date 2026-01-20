import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Metadata } from 'next'
import Link from 'next/link'
import { db } from '@/lib/db'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Truck, Shield, ArrowLeft, Star, Heart, Share2, Check } from 'lucide-react'
import { AddToCartButton } from '@/components/add-to-cart-button'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await db.product.findUnique({
    where: { slug: params.slug },
    include: { images: true },
  })

  if (!product) return { title: 'Product Not Found' }

  return {
    title: product.name,
    description: product.description.substring(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.substring(0, 160),
      images: product.images[0]?.url ? [{ url: product.images[0].url }] : [],
    },
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await db.product.findUnique({
    where: { slug: params.slug, published: true },
    include: {
      images: { orderBy: { position: 'asc' } },
      category: true,
      variants: true,
    },
  })

  if (!product) notFound()

  const discount = product.compareAtPrice
    ? Math.round(((Number(product.compareAtPrice) - Number(product.price)) / Number(product.compareAtPrice)) * 100)
    : 0

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.description,
            image: product.images[0]?.url,
            offers: {
              '@type': 'Offer',
              price: Number(product.price),
              priceCurrency: 'USD',
              availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            },
          }),
        }}
      />

      <div className="min-h-screen bg-muted/30">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-30">
          <div className="container py-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/products">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Shopping
              </Link>
            </Button>
          </div>
        </div>

        <div className="container py-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Images */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-xl overflow-hidden border bg-white shadow-sm">
                {product.images[0] ? (
                  <Image
                    src={product.images[0].url}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                    No image available
                  </div>
                )}
              </div>

              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.slice(0, 4).map((image: any, idx: number) => (
                    <div key={image.id} className="relative aspect-square rounded-lg overflow-hidden border hover:border-primary cursor-pointer transition bg-white">
                      <Image
                        src={image.url}
                        alt={`${product.name} ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Category & Rating */}
              <div>
                {product.category && (
                  <p className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">
                    {product.category.name}
                  </p>
                )}
                <h1 className="text-4xl font-bold tracking-tight mb-4">{product.name}</h1>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">(542 reviews)</span>
                </div>
              </div>

              <Separator />

              {/* Pricing */}
              <div className="space-y-3">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-blue-600">
                    {formatPrice(Number(product.price))}
                  </span>
                  {product.compareAtPrice && (
                    <>
                      <span className="text-xl text-muted-foreground line-through">
                        {formatPrice(Number(product.compareAtPrice))}
                      </span>
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">
                        Save {discount}%
                      </span>
                    </>
                  )}
                </div>

                {/* Stock Status */}
                <div className="flex items-center gap-2">
                  {product.stock > 0 ? (
                    <>
                      <div className="h-3 w-3 rounded-full bg-green-500" />
                      <span className="text-sm font-medium text-green-600">
                        In Stock ({product.stock} available)
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="h-3 w-3 rounded-full bg-red-500" />
                      <span className="text-sm font-medium text-red-600">Out of Stock</span>
                    </>
                  )}
                </div>
              </div>

              <Separator />

              {/* Description */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Product Details</h3>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>

              {/* Variants */}
              {product.variants.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Options</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.map((variant: any) => (
                        <Button key={variant.id} variant="outline" size="sm">
                          {variant.name}: {variant.value}
                        </Button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Separator />

              {/* Actions */}
              <div className="space-y-3">
                <AddToCartButton productId={product.id} slug={product.slug} disabled={product.stock === 0} />

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" size="lg">
                    <Heart className="mr-2 h-5 w-5" />
                    Save
                  </Button>
                  <Button variant="outline" size="lg">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Benefits */}
              <div className="space-y-3">
                {[
                  { icon: Truck, title: 'Fast Shipping', desc: 'Free on orders over $50' },
                  { icon: Shield, title: 'Secure Checkout', desc: 'SSL encrypted payment' },
                  { icon: Check, title: 'Quality Guaranteed', desc: '30-day money back' },
                ].map((benefit, i) => {
                  const Icon = benefit.icon
                  return (
                    <div key={i} className="flex gap-3">
                      <Icon className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">{benefit.title}</p>
                        <p className="text-xs text-muted-foreground">{benefit.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
