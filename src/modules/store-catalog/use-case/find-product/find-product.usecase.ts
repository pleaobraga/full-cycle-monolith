import { UsecaseInterface } from '../../../@shared/use-case/use-case.interface'
import { ProductGateway } from '../../gateway/product.gateway'
import { FindProductInputDTO, FindProductOutputDTO } from './find-product.dto'

export class FindProductUseCase implements UsecaseInterface {
  constructor(private readonly productGateway: ProductGateway) {}

  async execute(input: FindProductInputDTO): Promise<FindProductOutputDTO> {
    const product = await this.productGateway.find(input.id)

    return {
      id: product.id.id,
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice
    }
  }
}
