import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

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

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    console.log('✅ File buffer created, size:', buffer.length)

    // Создаем уникальное имя файла
    const fileExtension = path.extname(file.name)
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}${fileExtension}`
    console.log('📝 Generated filename:', fileName)
    
    // Путь для сохранения (в public для статических файлов)
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products')
    const filePath = path.join(uploadDir, fileName)
    console.log('📂 Current working directory:', process.cwd())
    console.log('📂 Upload directory:', uploadDir)
    console.log('📂 Full file path:', filePath)

    // Создаем директорию если её нет
    try {
      await mkdir(uploadDir, { recursive: true })
      console.log('✅ Directory created/verified:', uploadDir)
    } catch (dirError) {
      console.log('⚠️ Directory creation error (might already exist):', dirError)
    }

    // Сохраняем файл
    try {
      await writeFile(filePath, buffer)
      console.log('✅ File written successfully to:', filePath)
      
      // Проверяем, что файл действительно сохранился
      const fs = require('fs')
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath)
        console.log('✅ File exists after save, size:', stats.size)
      } else {
        console.log('❌ File does not exist after save!')
        throw new Error('File was not saved properly')
      }
    } catch (saveError) {
      console.error('❌ File save error:', saveError)
      throw saveError
    }

    // Возвращаем путь к файлу для использования в приложении
    const publicPath = `/uploads/products/${fileName}`
    console.log('🔗 Public path:', publicPath)
    console.log('✅ Upload completed successfully')

    return NextResponse.json({
      success: true,
      filePath: publicPath,
      fileName: fileName,
      fileSize: buffer.length
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