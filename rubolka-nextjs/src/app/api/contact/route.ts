import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, email, message } = body

    // Валидация данных
    if (!name || !phone || !email) {
      return NextResponse.json({
        success: false,
        error: 'Пожалуйста, заполните все обязательные поля'
      }, { status: 400 })
    }

    // Здесь бы была логика отправки email или сохранения в базу данных
    console.log('Новое сообщение:', {
      name,
      phone, 
      email,
      message,
      timestamp: new Date().toISOString()
    })

    // Симуляция отправки email
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: 'Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.'
    })
  } catch (error) {
    console.error('Ошибка обработки контактной формы:', error)
    return NextResponse.json({
      success: false,
      error: 'Произошла ошибка при отправке сообщения'
    }, { status: 500 })
  }
} 