import { NextResponse } from 'next/server'
import { MockStorage } from '@/lib/mock-data'

export async function GET() {
  try {
    const storageInfo = MockStorage.getStorageInfo()
    const allProducts = MockStorage.getAllProducts()
    
    return NextResponse.json({
      success: true,
      storage: storageInfo,
      products: allProducts,
      message: 'Состояние серверного хранилища'
    })
  } catch (error) {
    console.error('Debug API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Ошибка получения отладочной информации'
    }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    // Очищаем все товары кроме начальных
    const allProducts = MockStorage.getAllProducts()
    const initialIds = ['1', '2', '3'] // ID начальных товаров
    
    const toDelete = allProducts.filter((p: any) => !initialIds.includes(p.id))
    
    let deletedCount = 0
    toDelete.forEach((product: any) => {
      if (MockStorage.deleteProduct(product.id)) {
        deletedCount++
      }
    })
    
    return NextResponse.json({
      success: true,
      message: `Удалено ${deletedCount} товаров`,
      remaining: MockStorage.getStorageInfo()
    })
  } catch (error) {
    console.error('Debug DELETE error:', error)
    return NextResponse.json({
      success: false,
      error: 'Ошибка очистки хранилища'
    }, { status: 500 })
  }
} 