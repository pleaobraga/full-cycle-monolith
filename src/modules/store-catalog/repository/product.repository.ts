import { Id } from '../../@shared/domain/value-object/id.value-object'
import { Product } from '../domain/product.entity'
import { ProductGateway } from '../gateway/product.gateway'
import { ProductModel } from './product.model'

export class ProductRepository implements ProductGateway {
  async findAll(): Promise<Product[]> {
    const products = await ProductModel.findAll()

    return products.map((product) => {
      return new Product({
        id: new Id(product.id),
        name: product.name,
        description: product.description,
        salesPrice: product.salesPrice
      })
    })
  }

  async find(id: string): Promise<Product> {
    const product = await ProductModel.findOne({
      where: { id }
    })

    if (!product) {
      throw new Error('Product not found')
    }

    return new Product({
      id: new Id(product.id),
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice
    })
  }

  async upsert(product: Product): Promise<void> {
    const existingProduct = await ProductModel.findOne({
      where: { id: product.id.id }
    })

    if (existingProduct) {
      await ProductModel.update(
        {
          name: product.name,
          description: product.description,
          salesprice: product.salesPrice
        },
        {
          where: { id: product.id.id }
        }
      )
    } else {
      await ProductModel.create({
        id: product.id.id,
        name: product.name,
        description: product.description,
        salesPrice: product.salesPrice
      })
    }
  }
}
