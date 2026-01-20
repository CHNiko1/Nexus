import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Metadata } from 'next'
import { db } from '@/lib/db'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart, Truck, Shield, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { AddToCartButton } from '@/components/add-to-cart-button'

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const product = await db.product.findUnique({
    where: { slug: params.slug },
    include: { images: true, category: true },
  })

  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

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
    where: {
      slug: params.slug,
      published: true,
    },
    include: {
      images: {
        orderBy: {
          position: 'asc',
        },
      },
      category: true,
      variants: true,
    },
  })

  if (!product) {
    notFound()
  }

  const structuredData = {
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
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="container py-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden border">
              {product.images[0] ? (
                <Image
                  src={product.images[0].url}
                  alt={product.images[0].alt || product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">No image available</span>
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.slice(1, 5).map((image: any, idx: number) => (
                  <div
                    key={image.id}
                    className="relative aspect-square rounded-lg overflow-hidden border cursor-pointer hover:border-primary"
                  >
                    <Image
                      src={image.url}
                      alt={image.alt || `${product.name} ${idx + 2}`}
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
            <div>
              {product.category && (
                <p className="text-sm text-muted-foreground mb-2">{product.category.name}</p>
              )}
              <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-bold">{formatPrice(Number(product.price))}</span>
              {product.compareAtPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(Number(product.compareAtPrice))}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4">
              {product.stock > 0 ? (
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm text-green-600 font-medium">
                    In Stock ({product.stock} available)
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="text-sm text-red-600 font-medium">Out of Stock</span>
                </div>
              )}
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            {product.variants.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Available Options</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant: any) => (
                    <Button key={variant.id} variant="outline" size="sm">
                      {variant.name}: {variant.value}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <AddToCartButton productId={product.id} slug={product.slug} disabled={product.stock === 0} />
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Fast Shipping</p>
                  <p className="text-sm text-muted-foreground">
                    Free shipping on orders over $50
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Secure Checkout</p>
                  <p className="text-sm text-muted-foreground">
                    Your payment information is encrypted
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
