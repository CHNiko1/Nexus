import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateImages() {
  console.log('Updating product images...')

  // Update Wireless Bluetooth Headphones images
  const headphones = await prisma.product.findUnique({
    where: { slug: 'wireless-bluetooth-headphones' },
    include: { images: true },
  })

  if (headphones) {
    // Delete old images
    await prisma.productImage.deleteMany({
      where: { productId: headphones.id },
    })

    // Create new images
    await prisma.productImage.createMany({
      data: [
        {
          productId: headphones.id,
          url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
          alt: 'Wireless Bluetooth Headphones - Front view',
          position: 0,
        },
        {
          productId: headphones.id,
          url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop',
          alt: 'Wireless Bluetooth Headphones - Side view',
          position: 1,
        },
      ],
    })
    console.log('Updated Wireless Bluetooth Headphones images')
  }

  // Update Smart Watch Series 5 images
  const smartwatch = await prisma.product.findUnique({
    where: { slug: 'smart-watch-series-5' },
    include: { images: true },
  })

  if (smartwatch) {
    // Delete old images
    await prisma.productImage.deleteMany({
      where: { productId: smartwatch.id },
    })

    // Create new images
    await prisma.productImage.createMany({
      data: [
        {
          productId: smartwatch.id,
          url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop',
          alt: 'Smart Watch Series 5 - Front view',
          position: 0,
        },
        {
          productId: smartwatch.id,
          url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&h=800&fit=crop',
          alt: 'Smart Watch Series 5 - Side view',
          position: 1,
        },
      ],
    })
    console.log('Updated Smart Watch Series 5 images')
  }

  // Update Portable Bluetooth Speaker images
  const speaker = await prisma.product.findUnique({
    where: { slug: 'portable-bluetooth-speaker' },
    include: { images: true },
  })

  if (speaker) {
    // Delete old images
    await prisma.productImage.deleteMany({
      where: { productId: speaker.id },
    })

    // Create new images
    await prisma.productImage.createMany({
      data: [
        {
          productId: speaker.id,
          url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=800&fit=crop',
          alt: 'Portable Bluetooth Speaker - Front view',
          position: 0,
        },
        {
          productId: speaker.id,
          url: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=800&h=800&fit=crop',
          alt: 'Portable Bluetooth Speaker - Side view',
          position: 1,
        },
      ],
    })
    console.log('Updated Portable Bluetooth Speaker images')
  }

  console.log('Image update complete!')
}

updateImages()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
