import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = params
    
    // Путь к файлу
    const filePath = path.join(process.cwd(), 'uploads', 'products', filename)
    
    // Читаем файл
    const fileBuffer = await readFile(filePath)
    
    // Определяем тип содержимого на основе расширения файла
    const extension = path.extname(filename).toLowerCase()
    let contentType = 'image/jpeg'
    
    switch (extension) {
      case '.png':
        contentType = 'image/png'
        break
      case '.gif':
        contentType = 'image/gif'
        break
      case '.webp':
        contentType = 'image/webp'
        break
      case '.svg':
        contentType = 'image/svg+xml'
        break
      default:
        contentType = 'image/jpeg'
    }
    
    // Возвращаем файл с правильным заголовком
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000', // Кэшируем на год
      },
    })
    
  } catch (error) {
    console.error('File serving error:', error)
    return NextResponse.json({
      success: false,
      error: 'Файл не найден'
    }, { status: 404 })
  }
} 