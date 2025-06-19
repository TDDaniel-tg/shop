import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/models/Product'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    let query = {}
    if (category && category !== 'all') {
      query = { category }
    }

    const products = await Product.find(query).sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      products
    })
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
    await connectDB()
    
    const body = await request.json()
    
    const newProduct = new Product({
      name: body.name,
      price: Number(body.price),
      category: body.category,
      description: body.description,
      image: body.image || '/assets/catalog/placeholder.svg',
      colors: body.colors || [],
      sizes: body.sizes || [],
      material: body.material || 'Хлопок 100%'
    })

    const savedProduct = await newProduct.save()

    return NextResponse.json({
      success: true,
      product: savedProduct
    }, { status: 201 })
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
    await connectDB()
    
    const body = await request.json()
    const { _id, ...updateData } = body
    
    const updatedProduct = await Product.findByIdAndUpdate(
      _id,
      {
        ...updateData,
        price: Number(updateData.price),
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    )

    if (!updatedProduct) {
      return NextResponse.json({
        success: false,
        error: 'Товар не найден'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      product: updatedProduct
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
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('id')

    if (!productId) {
      return NextResponse.json({
        success: false,
        error: 'ID товара не указан'
      }, { status: 400 })
    }

    const deletedProduct = await Product.findByIdAndDelete(productId)
    
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