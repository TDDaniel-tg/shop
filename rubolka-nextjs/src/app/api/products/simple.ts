import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('🔥 SIMPLE API called')
    
    const body = await request.json()
    console.log('📝 Body:', body)
    
    // Просто возвращаем успех для тестирования
    return NextResponse.json({
      success: true,
      product: {
        id: Date.now().toString(),
        ...body,
        price: Number(body.price),
        colors: body.colors || [],
        sizes: body.sizes || [],
        image: body.image || '/assets/catalog/placeholder.svg'
      }
    })
  } catch (error) {
    console.error('❌ Simple API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Ошибка: ' + (error instanceof Error ? error.message : 'Unknown')
    }, { status: 500 })
  }
} 