import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'Файл не найден'
      }, { status: 400 })
    }

    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({
        success: false,
        error: 'Можно загружать только изображения'
      }, { status: 400 })
    }

    // Проверяем размер файла (максимум 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({
        success: false,
        error: 'Размер файла не должен превышать 5MB'
      }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Создаем уникальное имя файла
    const fileExtension = path.extname(file.name)
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}${fileExtension}`
    
    // Путь для сохранения (в public для статических файлов)
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products')
    const filePath = path.join(uploadDir, fileName)

    // Создаем директорию если её нет
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch {
      // Директория уже существует
    }

    // Сохраняем файл
    await writeFile(filePath, buffer)

    // Возвращаем путь к файлу для использования в приложении
    const publicPath = `/uploads/products/${fileName}`

    return NextResponse.json({
      success: true,
      filePath: publicPath,
      fileName: fileName
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({
      success: false,
      error: 'Ошибка при загрузке файла'
    }, { status: 500 })
  }
} 