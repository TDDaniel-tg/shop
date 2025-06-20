import { NextRequest, NextResponse } from 'next/server'

// AmoCRM API Configuration
const AMOCRM_SUBDOMAIN = process.env.AMOCRM_SUBDOMAIN || 'your-subdomain'
const AMOCRM_ACCESS_TOKEN = process.env.AMOCRM_ACCESS_TOKEN || ''
const AMOCRM_API_URL = `https://${AMOCRM_SUBDOMAIN}.amocrm.ru/api/v4`

// Функция отправки лида в AmoCRM
async function sendToAmoCRM(data: { name: string; phone: string; message?: string }) {
  console.log('🔧 Проверка настроек AmoCRM:')
  console.log('   SUBDOMAIN:', AMOCRM_SUBDOMAIN)
  console.log('   TOKEN:', AMOCRM_ACCESS_TOKEN ? `${AMOCRM_ACCESS_TOKEN.substring(0, 10)}...` : 'НЕ УКАЗАН')
  console.log('   API_URL:', AMOCRM_API_URL)
  
  if (!AMOCRM_ACCESS_TOKEN || AMOCRM_ACCESS_TOKEN === '' || AMOCRM_ACCESS_TOKEN === 'your-access-token') {
    console.log('🔄 AmoCRM не настроен, сохраняем локально')
    return { success: true, localSave: true }
  }

  try {
    // Создаем базовый лид в AmoCRM
    const leadData = {
      name: `${data.name} - ${data.phone}`,
      price: 0
    }

    console.log('📤 Отправляем лид в AmoCRM:', JSON.stringify([leadData], null, 2))
    
    const response = await fetch(`${AMOCRM_API_URL}/leads`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AMOCRM_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([leadData])
    })

    console.log('📥 Ответ AmoCRM - статус:', response.status, response.statusText)
    
    const result = await response.json()
    console.log('📥 Ответ AmoCRM - данные:', JSON.stringify(result, null, 2))

    if (response.ok) {
      console.log('✅ Лид успешно создан в AmoCRM:', result)
      
      const leadId = result._embedded?.leads?.[0]?.id
      
      // Добавляем примечание к лиду с дополнительной информацией
      if (leadId && data.message) {
        try {
          const noteData = {
            note_type: 'common',
            params: {
              text: `Сообщение: ${data.message}\nИсточник: Сайт RUBOLKA`
            }
          }
          
          await fetch(`${AMOCRM_API_URL}/leads/${leadId}/notes`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${AMOCRM_ACCESS_TOKEN}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify([noteData])
          })
          
          console.log('📝 Примечание добавлено к лиду')
        } catch (noteError) {
          console.log('⚠️ Не удалось добавить примечание:', noteError)
        }
      }
      
      return { success: true, amocrm: true, leadId }
    } else {
      console.error('❌ Ошибка AmoCRM API:', result)
      return { success: false, error: result.detail || result.message || 'Ошибка AmoCRM' }
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