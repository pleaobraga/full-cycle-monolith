import { UsecaseInterface } from '../../../@shared/use-case/use-case.interface'
import { ProductGateway } from '../../gateway/product.gateway'
import { FindAllProductsOutputDTO } from './find-all-products.dto'

export class FindAllProductsUseCase implements UsecaseInterface {
  constructor(private readonly productGateway: ProductGateway) {}

  async execute(): Promise<FindAllProductsOutputDTO> {
    const products = await this.productGateway.findAll()

    return {
      products: products.map((product) => ({
        id: product.id.id,
        name: product.name,
        description: product.description,
        salesPrice: product.salesPrice
      }))
    }
  }
}
