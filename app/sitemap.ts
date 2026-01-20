import { MetadataRoute } from 'next'
import { db } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vine-dropshipping.com'

  // Get all published products
  const products = await db.product.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  })

  // Get all categories
  const categories = await db.category.findMany({
    select: { slug: true, updatedAt: true },
  })

  // Static routes
  const routes = [
    '',
    '/products',
    '/contact',
    '/shipping',
    '/returns',
    '/privacy',
    '/terms',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Product routes
  const productRoutes = products.map((product: any) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // Category routes
  const categoryRoutes = categories.map((category: any) => ({
    url: `${baseUrl}/products?category=${category.slug}`,
    lastModified: category.updatedAt,
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  return [...routes, ...productRoutes, ...categoryRoutes]
}
