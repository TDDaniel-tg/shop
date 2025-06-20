import { NextRequest, NextResponse } from 'next/server'

// Функция для сжатия изображения
async function compressImage(file: File, maxWidth: number = 800, quality: number = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // Вычисляем новые размеры с сохранением пропорций
      let { width, height } = img
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }
      
      canvas.width = width
      canvas.height = height
      
      // Рисуем сжатое изображение
      ctx?.drawImage(img, 0, 0, width, height)
      
      // Конвертируем в base64 с сжатием
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality)
      resolve(compressedDataUrl)
    }
    
    img.onerror = () => reject(new Error('Ошибка загрузки изображения'))
    img.src = URL.createObjectURL(file)
  })
}

// Альтернативный метод сжатия на сервере (без canvas)
async function serverCompressImage(file: File): Promise<string> {
  // Для серверной части просто конвертируем в base64
  // В будущем можно добавить sharp или другую библиотеку для сжатия
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const base64 = buffer.toString('base64')
  const mimeType = file.type
  return `data:${mimeType};base64,${base64}`
}

export async function POST(request: NextRequest) {
  try {
    console.log('🎯 === UPLOAD API START ===')
    console.log('📤 Upload request received')
    console.log('📍 Request URL:', request.url)
    console.log('📍 Request method:', request.method)
    console.log('📍 Headers:', Object.fromEntries(request.headers.entries()))
    
    let formData
    try {
      formData = await request.formData()
      console.log('📝 FormData received successfully')
      console.log('📝 FormData keys:', Array.from(formData.keys()))
    } catch (formError) {
      console.error('❌ Error parsing FormData:', formError)
      return NextResponse.json({
        success: false,
        error: 'Ошибка парсинга FormData: ' + (formError instanceof Error ? formError.message : 'Unknown error')
      }, { status: 400 })
    }
    
    const file = formData.get('file') as File

    if (!file) {
      console.log('❌ No file provided in formData')
      console.log('📝 FormData entries:', Array.from(formData.entries()))
      return NextResponse.json({
        success: false,
        error: 'Файл не найден в запросе'
      }, { status: 400 })
    }

    console.log('📁 File details:', {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified
    })

    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      console.log('❌ Invalid file type:', file.type)
      return NextResponse.json({
        success: false,
        error: `Можно загружать только изображения. Получен тип: ${file.type}`
      }, { status: 400 })
    }

    // Проверяем размер файла (максимум 10MB для исходного файла)
    if (file.size > 10 * 1024 * 1024) {
      console.log('❌ File too large:', file.size)
      return NextResponse.json({
        success: false,
        error: `Размер файла не должен превышать 10MB. Размер файла: ${Math.round(file.size / 1024 / 1024 * 100) / 100}MB`
      }, { status: 400 })
    }

    console.log('✅ File validation passed')

    // Используем серверное сжатие (без canvas так как мы на сервере)
    let dataUrl
    try {
      console.log('🔄 Converting to base64...')
      dataUrl = await serverCompressImage(file)
      console.log('✅ Base64 conversion completed')
      console.log('📊 DataURL length:', dataUrl.length)
      console.log('📊 Original size:', file.size)
      console.log('📊 Base64 ratio:', Math.round((dataUrl.length / file.size) * 100) + '%')
    } catch (compressionError) {
      console.error('❌ Error converting to base64:', compressionError)
      return NextResponse.json({
        success: false,
        error: 'Ошибка конвертации изображения: ' + (compressionError instanceof Error ? compressionError.message : 'Unknown error')
      }, { status: 500 })
    }

    // Увеличенный лимит для base64 (8MB)
    if (dataUrl.length > 8 * 1024 * 1024) {
      console.log('⚠️ Image still too large:', dataUrl.length)
      return NextResponse.json({
        success: false,
        error: `Изображение слишком большое. Попробуйте уменьшить разрешение или выбрать другое изображение. Текущий размер: ${Math.round(dataUrl.length / 1024 / 1024 * 100) / 100}MB`
      }, { status: 400 })
    }

    // Возвращаем data URL для сохранения в базе данных
    console.log('🔗 Returning data URL for database storage')
    console.log('✅ === UPLOAD API SUCCESS ===')

    return NextResponse.json({
      success: true,
      filePath: dataUrl, // Возвращаем data URL вместо пути к файлу
      fileName: file.name,
      fileSize: dataUrl.length,
      mimeType: file.type,
      debug: {
        originalSize: file.size,
        base64Size: dataUrl.length,
        compressionRatio: Math.round((dataUrl.length / file.size) * 100) + '%'
      }
    })

  } catch (error) {
    console.error('❌ === UPLOAD API ERROR ===')
    console.error('❌ Upload error:', error)
    console.error('❌ Error stack:', (error as Error).stack)
    return NextResponse.json({
      success: false,
      error: 'Ошибка при загрузке файла: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 })
  }
} 