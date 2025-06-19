import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'



export async function GET() {
  try {
    await connectDB()
    
    const orders = await Order.find({}).sort({ createdAt: -1 })
    
    return NextResponse.json({
      success: true,
      orders
    })
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
    await connectDB()
    
    const body = await request.json()
    
    const newOrder = new Order({
      customerName: body.customerName,
      email: body.email,
      phone: body.phone,
      products: body.products,
      totalAmount: body.totalAmount
    })

    const savedOrder = await newOrder.save()

    return NextResponse.json({
      success: true,
      order: savedOrder,
      message: 'Заказ успешно создан'
    }, { status: 201 })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Ошибка создания заказа'
    }, { status: 400 })
  }
} 