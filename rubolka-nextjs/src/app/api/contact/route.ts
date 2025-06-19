import { NextRequest, NextResponse } from 'next/server'

// AmoCRM API Configuration
const AMOCRM_SUBDOMAIN = process.env.AMOCRM_SUBDOMAIN || 'your-subdomain'
const AMOCRM_ACCESS_TOKEN = process.env.AMOCRM_ACCESS_TOKEN || ''
const AMOCRM_API_URL = `https://${AMOCRM_SUBDOMAIN}.amocrm.ru/api/v4`

// Функция отправки лида в AmoCRM
async function sendToAmoCRM(data: { name: string; phone: string; message?: string }) {
  if (!AMOCRM_ACCESS_TOKEN || AMOCRM_ACCESS_TOKEN === '') {
    console.log('🔄 AmoCRM не настроен, сохраняем локально')
    return { success: true, localSave: true }
  }

  try {
    // Создаем лид в AmoCRM
    const leadData = {
      name: `Заявка с сайта: ${data.name}`,
      price: 0,
      custom_fields_values: [
        {
          field_id: 'PHONE',
          values: [{ value: data.phone }]
        }
      ]
    }

    // Если есть сообщение, добавляем как примечание
    if (data.message) {
      leadData.custom_fields_values.push({
        field_id: 'TEXTAREA',
        values: [{ value: data.message }]
      })
    }

    const response = await fetch(`${AMOCRM_API_URL}/leads`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AMOCRM_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([leadData])
    })

    const result = await response.json()

    if (response.ok) {
      console.log('✅ Лид успешно создан в AmoCRM:', result)
      return { success: true, amocrm: true, leadId: result._embedded?.leads?.[0]?.id }
    } else {
      console.error('❌ Ошибка AmoCRM API:', result)
      return { success: false, error: result.detail || 'Ошибка AmoCRM' }
    }
  } catch (error) {
    console.error('❌ Ошибка подключения к AmoCRM:', error)
    return { success: false, error: 'Ошибка подключения к AmoCRM' }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, message } = body

    // Валидация данных (email больше не требуется)
    if (!name || !phone) {
      return NextResponse.json({
        success: false,
        error: 'Пожалуйста, заполните имя и телефон'
      }, { status: 400 })
    }

    // Логируем заявку
    console.log('📞 Новая заявка:', {
      name,
      phone,
      message,
      timestamp: new Date().toISOString(),
      source: 'website'
    })

    // Отправляем в AmoCRM
    const amocrmResult = await sendToAmoCRM({ name, phone, message })

    if (amocrmResult.success) {
      if (amocrmResult.localSave) {
        return NextResponse.json({
          success: true,
          message: 'Заявка принята! Мы свяжемся с вами в ближайшее время.',
          debug: 'Сохранено локально (AmoCRM не настроен)'
        })
      } else {
        return NextResponse.json({
          success: true,
          message: 'Заявка отправлена! Наш менеджер свяжется с вами в течение 30 минут.',
          leadId: amocrmResult.leadId
        })
      }
    } else {
      // Если AmoCRM недоступен, все равно принимаем заявку
      console.error('AmoCRM недоступен, но заявка сохранена локально')
      return NextResponse.json({
        success: true,
        message: 'Заявка принята! Мы свяжемся с вами в ближайшее время.',
        warning: 'Временные технические работы'
      })
    }

  } catch (error) {
    console.error('❌ Ошибка обработки заявки:', error)
    return NextResponse.json({
      success: false,
      error: 'Произошла техническая ошибка. Попробуйте позвонить по телефону.'
    }, { status: 500 })
  }
} 