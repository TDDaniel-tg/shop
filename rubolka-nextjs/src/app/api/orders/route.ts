import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { MockStorage, isDatabaseAvailable } from '@/lib/mock-data'

export async function GET() {
  try {
    // Проверяем доступность базы данных
    const dbAvailable = isDatabaseAvailable()
    
    if (!dbAvailable) {
      console.log('🔄 Using mock data for orders (database not available)')
      return NextResponse.json({
        success: true,
        orders: MockStorage.getAllOrders()
      })
    }

    try {
      const orders = await prisma.order.findMany({
        include: {
          items: true
        },
        orderBy: { createdAt: 'desc' }
      })

      // Преобразуем суммы из копеек в рубли
      const formattedOrders = orders.map((order: any) => ({
        ...order,
        totalAmount: order.totalAmount / 100,
        items: order.items.map((item: any) => ({
          ...item,
          price: item.price / 100
        }))
      }))

      return NextResponse.json({
        success: true,
        orders: formattedOrders
      })
    } catch (dbError) {
      console.error('❌ Database connection failed, falling back to mock data:', dbError)
      
      return NextResponse.json({
        success: true,
        orders: MockStorage.getAllOrders(),
        warning: 'Using mock data - database unavailable'
      })
    }
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({
      success: false,
      error: 'Ошибка загрузки заказов'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Проверяем доступность базы данных
    const dbAvailable = isDatabaseAvailable()
    
    if (!dbAvailable) {
      console.log('🔄 Mock order creation (database not available)')
      
      const mockOrder = MockStorage.createOrder({
        customerName: body.customerName,
        email: body.email,
        phone: body.phone,
        totalAmount: Number(body.totalAmount),
        status: body.status || 'pending',
        items: body.items || []
      })
      
      return NextResponse.json({
        success: true,
        order: mockOrder
      }, { status: 201 })
    }
    
    // Создаем заказ с товарами
    const newOrder = await prisma.order.create({
      data: {
        customerName: body.customerName,
        email: body.email,
        phone: body.phone,
        totalAmount: Math.round(Number(body.totalAmount) * 100), // в копейки
        status: body.status || 'pending',
        items: {
          create: body.items.map((item: any) => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            price: Math.round(Number(item.price) * 100) // в копейки
          }))
        }
      },
      include: {
        items: true
      }
    })

    // Форматируем ответ
    const formattedOrder = {
      ...newOrder,
      totalAmount: newOrder.totalAmount / 100,
      items: newOrder.items.map((item: any) => ({
        ...item,
        price: item.price / 100
      }))
    }

    return NextResponse.json({
      success: true,
      order: formattedOrder
    }, { status: 201 })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Ошибка создания заказа'
    }, { status: 400 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body
    
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        ...updateData,
        totalAmount: updateData.totalAmount ? Math.round(Number(updateData.totalAmount) * 100) : undefined
      },
      include: {
        items: true
      }
    })

    if (!updatedOrder) {
      return NextResponse.json({
        success: false,
        error: 'Заказ не найден'
      }, { status: 404 })
    }

    // Форматируем ответ
    const formattedOrder = {
      ...updatedOrder,
      totalAmount: updatedOrder.totalAmount / 100,
      items: updatedOrder.items.map((item: any) => ({
        ...item,
        price: item.price / 100
      }))
    }

    return NextResponse.json({
      success: true,
      order: formattedOrder
    })
  } catch (error) {
    console.error('Order update error:', error)
    return NextResponse.json({
      success: false,
      error: 'Ошибка обновления заказа'
    }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('id')

    if (!orderId) {
      return NextResponse.json({
        success: false,
        error: 'ID заказа не указан'
      }, { status: 400 })
    }

    const deletedOrder = await prisma.order.delete({
      where: { id: orderId }
    })
    
    if (!deletedOrder) {
      return NextResponse.json({
        success: false,
        error: 'Заказ не найден'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Заказ успешно удален'
    })
  } catch (error) {
    console.error('Order deletion error:', error)
    return NextResponse.json({
      success: false,
      error: 'Ошибка удаления заказа'
    }, { status: 400 })
  }
} 