import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('📤 Upload request received')
    console.log('📍 Request URL:', request.url)
    console.log('📍 Request method:', request.method)
    
    const formData = await request.formData()
    console.log('📝 FormData keys:', Array.from(formData.keys()))
    
    const file = formData.get('file') as File

    if (!file) {
      console.log('❌ No file provided in formData')
      console.log('📝 FormData entries:', Array.from(formData.entries()))
      return NextResponse.json({
        success: false,
        error: 'Файл не найден'
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
        error: 'Можно загружать только изображения'
      }, { status: 400 })
    }

    // Проверяем размер файла (максимум 5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.log('❌ File too large:', file.size)
      return NextResponse.json({
        success: false,
        error: 'Размер файла не должен превышать 5MB'
      }, { status: 400 })
    }

    // Конвертируем файл в base64 для сохранения в БД
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    console.log('✅ File buffer created, size:', buffer.length)

    // Создаем base64 строку с mime-type
    const base64 = buffer.toString('base64')
    const mimeType = file.type
    const dataUrl = `data:${mimeType};base64,${base64}`
    
    console.log('✅ Base64 conversion completed')
    console.log('📊 Base64 length:', base64.length)
    console.log('📊 DataURL length:', dataUrl.length)

    // Возвращаем data URL для сохранения в базе данных
    console.log('🔗 Returning data URL for database storage')
    console.log('✅ Upload completed successfully')

    return NextResponse.json({
      success: true,
      filePath: dataUrl, // Возвращаем data URL вместо пути к файлу
      fileName: file.name,
      fileSize: buffer.length,
      mimeType: mimeType
    })

  } catch (error) {
    console.error('❌ Upload error:', error)
    console.error('❌ Error stack:', (error as Error).stack)
    return NextResponse.json({
      success: false,
      error: 'Ошибка при загрузке файла: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 })
  }
} 