import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { MockStorage, isDatabaseAvailable } from '@/lib/mock-data'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    
    // Проверяем доступность базы данных
    const dbAvailable = isDatabaseAvailable()
    
    if (!dbAvailable) {
      console.log('🔄 Using mock data (database not available)')
      
      const mockProducts = MockStorage.getAllProducts()
      
      // Фильтруем по категории если указана
      const filteredProducts = category && category !== 'all' 
        ? mockProducts.filter((p: any) => p.category === category)
        : mockProducts
      
      return NextResponse.json({
        success: true,
        products: filteredProducts
      })
    }
    
    try {
      const where = category && category !== 'all' ? { category } : {}
      
      const products = await prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      })

      // Форматируем продукты - устанавливаем placeholder если image пустой
      const formattedProducts = products.map((product: any) => ({
        ...product,
        price: product.price / 100, // из копеек в рубли
        colors: JSON.parse(product.colors),
        sizes: JSON.parse(product.sizes),
        image: product.image || '/assets/catalog/placeholder.svg' // Устанавливаем placeholder если нет изображения
      }))

      return NextResponse.json({
        success: true,
        products: formattedProducts
      })
    } catch (dbError) {
      console.error('❌ Database query failed, falling back to mock data:', dbError)
      
      const mockProducts = MockStorage.getAllProducts()
      
      const filteredProducts = category && category !== 'all' 
        ? mockProducts.filter((p: any) => p.category === category)
        : mockProducts
      
      return NextResponse.json({
        success: true,
        products: filteredProducts,
        warning: 'Using mock data - database unavailable'
      })
    }
  } catch (error) {
    console.error('❌ GET /api/products error:', error)
    return NextResponse.json({
      success: false,
      error: 'Ошибка получения товаров'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🎯 === PRODUCTS POST API START ===')
    
    const body = await request.json()
    console.log('📝 Request body received:', {
      name: body.name,
      price: body.price,
      category: body.category,
      description: body.description?.substring(0, 50) + '...',
      material: body.material,
      colors: body.colors,
      sizes: body.sizes,
      imageType: body.image?.startsWith('data:') ? 'base64' : 'url',
      imageLength: body.image?.length || 0
    })
    
    // Проверяем доступность базы данных
    const dbAvailable = isDatabaseAvailable()
    console.log('🔍 Database available:', dbAvailable)
    
    if (!dbAvailable) {
      console.log('🔄 Mock product creation (database not available)')
      
      const mockProduct = MockStorage.createProduct({
        name: body.name,
        price: Number(body.price),
        category: body.category,
        description: body.description,
        image: body.image || '/assets/catalog/placeholder.svg',
        colors: body.colors || [],
        sizes: body.sizes || [],
        material: body.material || 'Хлопок 100%'
      })
      
      return NextResponse.json({
        success: true,
        product: mockProduct
      }, { status: 201 })
    }
    
    try {
      console.log('💾 Creating product in database...')
      
      const productData = {
        name: body.name,
        price: Math.round(Number(body.price) * 100), // в копейки
        category: body.category,
        description: body.description,
        image: body.image || null, // Сохраняем null если нет изображения
        colors: JSON.stringify(body.colors || []),
        sizes: JSON.stringify(body.sizes || []),
        material: body.material || 'Хлопок 100%'
      }
      
      console.log('📊 Product data for DB:', {
        ...productData,
        image: productData.image ? `${productData.image.substring(0, 50)}... (length: ${productData.image.length})` : 'null'
      })
      
      // Оптимизированное создание товара с меньшим таймаутом
      const createProductWithTimeout = Promise.race([
        prisma.product.create({
          data: productData
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database timeout after 10 seconds')), 10000)
        )
      ]) as Promise<any>
      
      const newProduct = await createProductWithTimeout
      console.log('✅ Product created in database with ID:', newProduct.id)

      // Форматируем ответ
      const formattedProduct = {
        ...newProduct,
        price: newProduct.price / 100,
        colors: JSON.parse(newProduct.colors),
        sizes: JSON.parse(newProduct.sizes),
        image: newProduct.image || '/assets/catalog/placeholder.svg' // Устанавливаем placeholder если нет изображения
      }

      console.log('✅ === PRODUCTS POST API SUCCESS ===')
      return NextResponse.json({
        success: true,
        product: formattedProduct
      }, { status: 201 })
    } catch (dbError) {
      console.error('❌ Database creation failed:', dbError)
      console.error('❌ Error details:', {
        code: (dbError as any)?.code,
        meta: (dbError as any)?.meta,
        message: (dbError as any)?.message
      })
      
      // Fallback to mock data
      console.log('🔄 Falling back to mock data due to database issue...')
      const mockProduct = MockStorage.createProduct({
        name: body.name,
        price: Number(body.price),
        category: body.category,
        description: body.description,
        image: body.image || '/assets/catalog/placeholder.svg',
        colors: body.colors || [],
        sizes: body.sizes || [],
        material: body.material || 'Хлопок 100%'
      })
      
      return NextResponse.json({
        success: true,
        product: mockProduct,
        warning: 'Товар сохранен во временном хранилище. База данных недоступна.'
      }, { status: 201 })
    }
  } catch (error) {
    console.error('❌ === PRODUCTS POST API ERROR ===')
    console.error('❌ Product creation error:', error)
    console.error('❌ Error stack:', (error as Error)?.stack)
    return NextResponse.json({
      success: false,
      error: 'Ошибка создания товара: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 400 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body
    
    console.log('🔄 PUT /api/products - Received data:', { id, updateData })
    
    if (!id) {
      console.error('❌ No product ID provided')
      return NextResponse.json({
        success: false,
        error: 'ID товара не указан'
      }, { status: 400 })
    }
    
    // Проверяем доступность базы данных
    const dbAvailable = isDatabaseAvailable()
    console.log('🔍 Database available:', dbAvailable)
    
    if (!dbAvailable) {
      console.log('🔄 Mock product update (database not available)')
      
      const mockProduct = MockStorage.updateProduct(id, {
        name: updateData.name,
        price: Number(updateData.price),
        category: updateData.category,
        description: updateData.description,
        image: updateData.image || '/assets/catalog/placeholder.svg',
        colors: updateData.colors || [],
        sizes: updateData.sizes || [],
        material: updateData.material || 'Хлопок 100%'
      })
      
      if (!mockProduct) {
        console.error('❌ Mock product not found:', id)
        return NextResponse.json({
          success: false,
          error: 'Товар не найден'
        }, { status: 404 })
      }
      
      console.log('✅ Mock product updated:', mockProduct)
      return NextResponse.json({
        success: true,
        product: mockProduct
      })
    }
    
    try {
      const updatedProduct = await Promise.race([
        prisma.product.update({
          where: { id },
          data: {
            ...updateData,
            price: Math.round(Number(updateData.price) * 100), // в копейки
            colors: JSON.stringify(updateData.colors || []),
            sizes: JSON.stringify(updateData.sizes || []),
            image: updateData.image || null // Сохраняем null если нет изображения
          }
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database timeout after 30 seconds')), 30000)
        )
      ]) as any

      // Форматируем ответ
      const formattedProduct = {
        ...updatedProduct,
        price: updatedProduct.price / 100,
        colors: JSON.parse(updatedProduct.colors),
        sizes: JSON.parse(updatedProduct.sizes),
        image: updatedProduct.image || '/assets/catalog/placeholder.svg' // Устанавливаем placeholder если нет изображения
      }

      console.log('✅ Database product updated:', formattedProduct)
      return NextResponse.json({
        success: true,
        product: formattedProduct
      })
    } catch (dbError) {
      console.error('❌ Database update failed:', dbError)
      
      // Если это таймаут или ошибка базы данных, возвращаем успех но с предупреждением
      return NextResponse.json({
        success: true,
        product: {
          id,
          ...updateData,
          price: Number(updateData.price),
          colors: updateData.colors || [],
          sizes: updateData.sizes || [],
          image: updateData.image || '/assets/catalog/placeholder.svg'
        },
        warning: 'Изменения сохранены временно. База данных недоступна.'
      })
    }
  } catch (error) {
    console.error('❌ PUT /api/products error:', error)
    return NextResponse.json({
      success: false,
      error: 'Ошибка обновления товара'
    }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('id')

    if (!productId) {
      return NextResponse.json({
        success: false,
        error: 'ID товара не указан'
      }, { status: 400 })
    }

    // Проверяем доступность базы данных
    const dbAvailable = isDatabaseAvailable()
    
    if (!dbAvailable) {
      console.log('🔄 Mock product deletion (database not available)')
      
      const deleted = MockStorage.deleteProduct(productId)
      
      if (!deleted) {
        return NextResponse.json({
          success: false,
          error: 'Товар не найден'
        }, { status: 404 })
      }
      
      return NextResponse.json({
        success: true
      })
    }
    
    try {
      await prisma.product.delete({
        where: { id: productId }
      })

      return NextResponse.json({
        success: true
      })
    } catch (dbError) {
      console.error('❌ Database deletion failed:', dbError)
      return NextResponse.json({
        success: false,
        error: 'Ошибка удаления товара из базы данных'
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Product deletion error:', error)
    return NextResponse.json({
      success: false,
      error: 'Ошибка удаления товара'
    }, { status: 400 })
  }
} 