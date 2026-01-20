import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Create admin user
  const adminPassword = await hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@vine.com' },
    update: {},
    create: {
      email: 'admin@vine.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  })
  console.log('Created admin user:', admin.email)

  // Create test user
  const userPassword = await hash('password123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Test User',
      password: userPassword,
      role: 'USER',
    },
  })
  console.log('Created test user:', user.email)

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'electronics' },
      update: {},
      create: {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Latest electronic devices and gadgets',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'fashion' },
      update: {},
      create: {
        name: 'Fashion',
        slug: 'fashion',
        description: 'Trendy clothing and accessories',
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'home' },
      update: {},
      create: {
        name: 'Home & Living',
        slug: 'home',
        description: 'Furniture and home decor',
        image: 'https://images.unsplash.com/photo-1556912167-f556f1f39faa?w=400&h=400&fit=crop',
      },
    }),
  ])
  console.log('Created categories:', categories.length)

  // Create products
  const products = [
    {
      name: 'Wireless Bluetooth Headphones',
      slug: 'wireless-bluetooth-headphones',
      description:
        'Premium wireless headphones with active noise cancellation, 30-hour battery life, and superior sound quality. Perfect for music lovers and professionals.',
      price: 149.99,
      compareAtPrice: 199.99,
      cost: 75.0,
      stock: 50,
      categoryId: categories[0].id,
      featured: true,
      sku: 'WBH-001',
      supplier: 'TechSupply Co.',
      tags: ['audio', 'wireless', 'electronics'],
    },
    {
      name: 'Smart Watch Series 5',
      slug: 'smart-watch-series-5',
      description:
        'Advanced fitness tracker with heart rate monitoring, GPS, and 7-day battery life. Stay connected and healthy with our latest smartwatch.',
      price: 299.99,
      compareAtPrice: 349.99,
      cost: 150.0,
      stock: 35,
      categoryId: categories[0].id,
      featured: true,
      sku: 'SW-005',
      supplier: 'WearTech Inc.',
      tags: ['wearable', 'fitness', 'electronics'],
    },
    {
      name: 'Premium Leather Jacket',
      slug: 'premium-leather-jacket',
      description:
        'Genuine leather jacket with a classic design. Perfect for any season, combining style and durability.',
      price: 249.99,
      compareAtPrice: 299.99,
      cost: 120.0,
      stock: 25,
      categoryId: categories[1].id,
      featured: true,
      sku: 'PLJ-001',
      supplier: 'Fashion Direct',
      tags: ['clothing', 'outerwear', 'leather'],
    },
    {
      name: 'Designer Sunglasses',
      slug: 'designer-sunglasses',
      description:
        'Stylish UV-protected sunglasses with polarized lenses. Make a statement while protecting your eyes.',
      price: 89.99,
      compareAtPrice: 129.99,
      cost: 35.0,
      stock: 60,
      categoryId: categories[1].id,
      featured: false,
      sku: 'DS-001',
      supplier: 'Eyewear Plus',
      tags: ['accessories', 'sunglasses'],
    },
    {
      name: 'Minimalist Wall Clock',
      slug: 'minimalist-wall-clock',
      description:
        'Modern wall clock with silent movement. Perfect addition to any room with its clean and elegant design.',
      price: 39.99,
      compareAtPrice: 59.99,
      cost: 15.0,
      stock: 100,
      categoryId: categories[2].id,
      featured: false,
      sku: 'MWC-001',
      supplier: 'HomeDecor Ltd.',
      tags: ['decor', 'clock', 'minimalist'],
    },
    {
      name: 'Ergonomic Office Chair',
      slug: 'ergonomic-office-chair',
      description:
        'Comfortable office chair with lumbar support and adjustable height. Designed for long hours of work.',
      price: 199.99,
      compareAtPrice: 249.99,
      cost: 100.0,
      stock: 30,
      categoryId: categories[2].id,
      featured: true,
      sku: 'EOC-001',
      supplier: 'Office Furniture Pro',
      tags: ['furniture', 'office', 'chair'],
    },
    {
      name: 'Portable Bluetooth Speaker',
      slug: 'portable-bluetooth-speaker',
      description:
        'Waterproof Bluetooth speaker with 360-degree sound. Perfect for outdoor adventures and pool parties.',
      price: 79.99,
      compareAtPrice: 99.99,
      cost: 35.0,
      stock: 75,
      categoryId: categories[0].id,
      featured: false,
      sku: 'PBS-001',
      supplier: 'TechSupply Co.',
      tags: ['audio', 'bluetooth', 'portable'],
    },
    {
      name: 'Cotton T-Shirt Set (3-Pack)',
      slug: 'cotton-tshirt-set',
      description:
        'Premium quality cotton t-shirts in various colors. Soft, breathable, and perfect for everyday wear.',
      price: 49.99,
      compareAtPrice: 69.99,
      cost: 20.0,
      stock: 120,
      categoryId: categories[1].id,
      featured: false,
      sku: 'CTS-003',
      supplier: 'Fashion Direct',
      tags: ['clothing', 'basics', 'cotton'],
    },
    {
      name: 'Ceramic Vase Set',
      slug: 'ceramic-vase-set',
      description:
        'Elegant set of 3 ceramic vases in different sizes. Perfect for displaying flowers or as standalone decor.',
      price: 59.99,
      compareAtPrice: 79.99,
      cost: 25.0,
      stock: 45,
      categoryId: categories[2].id,
      featured: true,
      sku: 'CVS-003',
      supplier: 'HomeDecor Ltd.',
      tags: ['decor', 'vase', 'ceramic'],
    },
    {
      name: 'USB-C Hub 7-in-1',
      slug: 'usbc-hub-7in1',
      description:
        'Versatile USB-C hub with HDMI, USB 3.0, SD card reader, and more. Essential accessory for modern laptops.',
      price: 44.99,
      compareAtPrice: 59.99,
      cost: 18.0,
      stock: 90,
      categoryId: categories[0].id,
      featured: false,
      sku: 'UCH-701',
      supplier: 'TechSupply Co.',
      tags: ['accessories', 'usbc', 'hub'],
    },
  ]

  for (const productData of products) {
    // Set specific images based on product
    let imageUrls = [
      {
        url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
        alt: `${productData.name} - Front view`,
        position: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=800&fit=crop',
        alt: `${productData.name} - Side view`,
        position: 1,
      },
    ]

    // Custom images for specific products
    if (productData.slug === 'wireless-bluetooth-headphones') {
      imageUrls = [
        {
          url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
          alt: 'Wireless Bluetooth Headphones - Front view',
          position: 0,
        },
        {
          url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop',
          alt: 'Wireless Bluetooth Headphones - Side view',
          position: 1,
        },
      ]
    } else if (productData.slug === 'smart-watch-series-5') {
      imageUrls = [
        {
          url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop',
          alt: 'Smart Watch Series 5 - Front view',
          position: 0,
        },
        {
          url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&h=800&fit=crop',
          alt: 'Smart Watch Series 5 - Side view',
          position: 1,
        },
      ]
    } else if (productData.slug === 'premium-leather-jacket') {
      imageUrls = [
        {
          url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=800&fit=crop',
          alt: 'Premium Leather Jacket - Front view',
          position: 0,
        },
        {
          url: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=800&h=800&fit=crop',
          alt: 'Premium Leather Jacket - Side view',
          position: 1,
        },
      ]
    } else if (productData.slug === 'designer-sunglasses') {
      imageUrls = [
        {
          url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=800&fit=crop',
          alt: 'Designer Sunglasses - Front view',
          position: 0,
        },
        {
          url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&h=800&fit=crop',
          alt: 'Designer Sunglasses - Side view',
          position: 1,
        },
      ]
    } else if (productData.slug === 'portable-bluetooth-speaker') {
      imageUrls = [
        {
          url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=800&fit=crop',
          alt: 'Portable Bluetooth Speaker - Front view',
          position: 0,
        },
        {
          url: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=800&h=800&fit=crop',
          alt: 'Portable Bluetooth Speaker - Side view',
          position: 1,
        },
      ]
    }

    const product = await prisma.product.create({
      data: {
        ...productData,
        images: {
          create: imageUrls,
        },
      },
    })
    console.log('Created product:', product.name)
  }

  // Create discount codes
  await prisma.discountCode.create({
    data: {
      code: 'WELCOME10',
      type: 'PERCENTAGE',
      value: 10,
      minPurchase: 50,
      maxUses: 100,
      active: true,
      expiresAt: new Date('2026-12-31'),
    },
  })

  await prisma.discountCode.create({
    data: {
      code: 'SAVE20',
      type: 'FIXED',
      value: 20,
      minPurchase: 100,
      maxUses: 50,
      active: true,
      expiresAt: new Date('2026-06-30'),
    },
  })

  console.log('Seeding finished.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
