import { Id } from '../../@shared/domain/value-object/id.value-object'
import { Product } from '../domain/product.entity'
import { ProductGateway } from '../gateway/product.gateway'
import { AddProductInputDTO, AddProductOutputDTO } from './add-product.dto'

export class AddProductUseCase {
  constructor(private readonly productRepository: ProductGateway) {}

  async execute(input: AddProductInputDTO): Promise<AddProductOutputDTO> {
    const props = {
      id: new Id(input.id),
      name: input.name,
      description: input.description,
      purchasePrice: input.purchasePrice,
      stock: input.stock
    }

    const product = new Product(props)

    await this.productRepository.add(product)

    const output: AddProductOutputDTO = {
      id: product.id.id,
      name: product.name,
      description: product.description,
      purchasePrice: product.purchasePrice,
      stock: product.stock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    }

    return output
  }
}
