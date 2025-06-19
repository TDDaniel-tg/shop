import { NextRequest, NextResponse } from 'next/server'

// Временные данные для демонстрации
let mockProducts = [
  {
    _id: '1',
    name: 'Женская футболка базовая',
    price: 450,
    image: '/assets/catalog/women.jpg',
    category: 'women',
    colors: ['Белый', 'Черный', 'Серый'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Качественная базовая футболка из хлопка',
    material: 'Хлопок 100%',
    createdAt: '2024-01-15'
  },
  {
    _id: '2',
    name: 'Мужская футболка oversize',
    price: 520,
    image: '/assets/catalog/men.jpg',
    category: 'men',
    colors: ['Белый', 'Черный', 'Синий'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Стильная oversize футболка',
    material: 'Хлопок 95%, эластан 5%',
    createdAt: '2024-01-10'
  },
  {
    _id: '3',
    name: 'Унисекс футболка с принтом',
    price: 590,
    image: '/assets/catalog/unisex.jpg',
    category: 'unisex',
    colors: ['Белый', 'Черный', 'Красный'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'Универсальная футболка с возможностью печати',
    material: 'Хлопок 100%',
    createdAt: '2024-01-20'
  }
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')

  let filteredProducts = mockProducts

  if (category && category !== 'all') {
    filteredProducts = mockProducts.filter(product => product.category === category)
  }

  return NextResponse.json({
    success: true,
    products: filteredProducts
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Создание нового продукта
    const newProduct = {
      _id: Date.now().toString(),
      name: body.name,
      price: Number(body.price),
      category: body.category,
      description: body.description,
      image: body.image || '/assets/catalog/placeholder.jpg',
      colors: body.colors || [],
      sizes: body.sizes || [],
      material: body.material || 'Хлопок 100%',
      createdAt: new Date().toLocaleDateString('ru-RU')
    }

    mockProducts.push(newProduct)

    return NextResponse.json({
      success: true,
      product: newProduct
    }, { status: 201 })
  } catch (err) {
    console.error('Product creation error:', err)
    return NextResponse.json({
      success: false,
      error: 'Ошибка создания продукта'
    }, { status: 400 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { _id, ...updateData } = body
    
    const productIndex = mockProducts.findIndex(p => p._id === _id)
    
    if (productIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Товар не найден'
      }, { status: 404 })
    }

    // Обновление товара
    mockProducts[productIndex] = {
      ...mockProducts[productIndex],
      ...updateData,
      price: Number(updateData.price)
    }

    return NextResponse.json({
      success: true,
      product: mockProducts[productIndex]
    })
  } catch (err) {
    console.error('Product update error:', err)
    return NextResponse.json({
      success: false,
      error: 'Ошибка обновления продукта'
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

    const productIndex = mockProducts.findIndex(p => p._id === productId)
    
    if (productIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Товар не найден'
      }, { status: 404 })
    }

    // Удаление товара
    mockProducts.splice(productIndex, 1)

    return NextResponse.json({
      success: true,
      message: 'Товар успешно удален'
    })
  } catch (err) {
    console.error('Product deletion error:', err)
    return NextResponse.json({
      success: false,
      error: 'Ошибка удаления продукта'
    }, { status: 400 })
  }
} 