import { Id } from '../../../@shared/domain/value-object/id.value-object'
import { Product } from '../../domain/product.entity'
import { ProductGateway } from '../../gateway/product.gateway'
import { UpsertProductOutputDTO, UpsertProductInputDTO } from './upsert-product.dto'

export class UpsertProductUseCase {
  constructor(private readonly productRepository: ProductGateway) {}

  async execute(input: UpsertProductInputDTO): Promise<UpsertProductOutputDTO> {
    const props = {
      id: new Id(input.id),
      name: input.name,
      description: input.description,
      salesPrice: input.salesPrice
    }

    const product = new Product(props)

    await this.productRepository.upsert(product)

    const output: UpsertProductOutputDTO = {
      id: product.id.id,
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice
    }

    return output
  }
}
