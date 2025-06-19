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
      console.log('🔄 Using mock data for products (database not available)')
      let filteredProducts = MockStorage.getAllProducts()
      
      if (category && category !== 'all') {
        filteredProducts = filteredProducts.filter((p: any) => p.category === category)
      }
      
      return NextResponse.json({
        success: true,
        products: filteredProducts
      })
    }

    const where = category && category !== 'all' ? { category } : {}

    try {
      const products = await prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      })

      // Преобразуем JSON строки обратно в массивы и цены из копеек в рубли
      const formattedProducts = products.map((product: any) => ({
        ...product,
        price: product.price / 100, // из копеек в рубли
        colors: JSON.parse(product.colors),
        sizes: JSON.parse(product.sizes)
      }))

      return NextResponse.json({
        success: true,
        products: formattedProducts
      })
    } catch (dbError) {
      console.error('❌ Database connection failed, falling back to mock data:', dbError)
      
      let filteredProducts = MockStorage.getAllProducts()
      
      if (category && category !== 'all') {
        filteredProducts = filteredProducts.filter((p: any) => p.category === category)
      }
      
      return NextResponse.json({
        success: true,
        products: filteredProducts,
        warning: 'Using mock data - database unavailable'
      })
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({
      success: false,
      error: 'Ошибка загрузки товаров'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Проверяем доступность базы данных
    const dbAvailable = isDatabaseAvailable()
    
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
      const newProduct = await prisma.product.create({
        data: {
          name: body.name,
          price: Math.round(Number(body.price) * 100), // в копейки
          category: body.category,
          description: body.description,
          image: body.image || '/assets/catalog/placeholder.svg',
          colors: JSON.stringify(body.colors || []),
          sizes: JSON.stringify(body.sizes || []),
          material: body.material || 'Хлопок 100%'
        }
      })

      // Форматируем ответ
      const formattedProduct = {
        ...newProduct,
        price: newProduct.price / 100,
        colors: JSON.parse(newProduct.colors),
        sizes: JSON.parse(newProduct.sizes)
      }

      return NextResponse.json({
        success: true,
        product: formattedProduct
      }, { status: 201 })
    } catch (dbError) {
      console.error('❌ Database creation failed, falling back to mock data:', dbError)
      
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
        warning: 'Using mock data - database unavailable'
      }, { status: 201 })
    }
  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Ошибка создания товара'
    }, { status: 400 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body
    
    // Проверяем доступность базы данных
    const dbAvailable = isDatabaseAvailable()
    
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
        return NextResponse.json({
          success: false,
          error: 'Товар не найден'
        }, { status: 404 })
      }
      
      return NextResponse.json({
        success: true,
        product: mockProduct
      })
    }
    
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...updateData,
        price: Math.round(Number(updateData.price) * 100), // в копейки
        colors: JSON.stringify(updateData.colors || []),
        sizes: JSON.stringify(updateData.sizes || [])
      }
    })

    if (!updatedProduct) {
      return NextResponse.json({
        success: false,
        error: 'Товар не найден'
      }, { status: 404 })
    }

    // Форматируем ответ
    const formattedProduct = {
      ...updatedProduct,
      price: updatedProduct.price / 100,
      colors: JSON.parse(updatedProduct.colors),
      sizes: JSON.parse(updatedProduct.sizes)
    }

    return NextResponse.json({
      success: true,
      product: formattedProduct
    })
  } catch (error) {
    console.error('Product update error:', error)
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
        success: true,
        message: 'Товар успешно удален'
      })
    }

    const deletedProduct = await prisma.product.delete({
      where: { id: productId }
    })
    
    if (!deletedProduct) {
      return NextResponse.json({
        success: false,
        error: 'Товар не найден'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Товар успешно удален'
    })
  } catch (error) {
    console.error('Product deletion error:', error)
    return NextResponse.json({
      success: false,
      error: 'Ошибка удаления товара'
    }, { status: 400 })
  }
} 