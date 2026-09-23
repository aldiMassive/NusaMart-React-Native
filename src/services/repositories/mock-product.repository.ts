import { mockCategories, mockProducts } from '@/mocks/catalog'
import { ProductRepository } from '@/services/repositories/contracts'
import { Product, ProductFilters } from '@/types/commerce'
import { withLatency } from '@/utils/async'

const filterProducts = (filters?: ProductFilters): Product[] => {
  let result = [...mockProducts]
  const query = filters?.query?.trim().toLowerCase()
  if (query)
    result = result.filter(product =>
      product.name.toLowerCase().includes(query)
    )
  if (filters?.categoryId)
    result = result.filter(product => product.categoryId === filters.categoryId)
  if (filters?.minRating)
    result = result.filter(product => product.rating >= filters.minRating!)
  if (filters?.sort === 'price-asc') result.sort((a, b) => a.price - b.price)
  if (filters?.sort === 'price-desc') result.sort((a, b) => b.price - a.price)
  if (filters?.sort === 'popular')
    result.sort((a, b) => b.soldCount - a.soldCount)
  if (!filters?.sort || filters.sort === 'recommended') {
    result.sort(
      (a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating
    )
  }
  return result
}

export class MockProductRepository implements ProductRepository {
  getProducts(filters?: ProductFilters) {
    return withLatency(filterProducts(filters))
  }
  getProductById(id: string) {
    return withLatency(mockProducts.find(product => product.id === id) ?? null)
  }
  getCategories() {
    return withLatency([...mockCategories])
  }
}
