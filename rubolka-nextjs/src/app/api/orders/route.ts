import { NextRequest, NextResponse } from 'next/server'

// Временные данные для демонстрации
const mockOrders = [
  {
    _id: '1',
    customerName: 'Иван Петров',
    email: 'ivan@example.com',
    phone: '+7 999 123-45-67',
    products: [
      { 
        productId: '1', 
        productName: 'Женская футболка базовая',
        quantity: 100, 
        size: 'M', 
        color: 'Белый',
        price: 450
      }
    ],
    totalAmount: 45000,
    status: 'pending',
    createdAt: '2024-01-20'
  },
  {
    _id: '2',
    customerName: 'Анна Смирнова',
    email: 'anna@example.com',
    phone: '+7 999 234-56-78',
    products: [
      { 
        productId: '2', 
        productName: 'Мужская футболка oversize',
        quantity: 50, 
        size: 'L', 
        color: 'Черный',
        price: 520
      }
    ],
    totalAmount: 26000,
    status: 'processing',
    createdAt: '2024-01-18'
  },
  {
    _id: '3',
    customerName: 'Олег Васильев',
    email: 'oleg@example.com',
    phone: '+7 999 345-67-89',
    products: [
      { 
        productId: '3', 
        productName: 'Унисекс футболка с принтом',
        quantity: 30, 
        size: 'M', 
        color: 'Белый',
        price: 590
      }
    ],
    totalAmount: 17700,
    status: 'completed',
    createdAt: '2024-01-15'
  }
]

export async function GET() {
  return NextResponse.json({
    success: true,
    orders: mockOrders
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const newOrder = {
      _id: Date.now().toString(),
      ...body,
      status: 'pending',
      createdAt: new Date().toLocaleDateString('ru-RU')
    }

    // Для readonly массива можно добавить в реальной БД
    
    return NextResponse.json({
      success: true,
      order: newOrder,
      message: 'Заказ успешно создан'
    }, { status: 201 })
  } catch (err) {
    console.error('Order creation error:', err)
    return NextResponse.json({
      success: false,
      error: 'Ошибка создания заказа'
    }, { status: 400 })
  }
} 