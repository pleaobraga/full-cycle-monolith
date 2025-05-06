import { Product } from '../domain/product.entity'

export interface ProductGateway {
  findAll(): Promise<Product[]>
  find(id: string): Promise<Product>
  upsert(product: Product): Promise<void>
}
