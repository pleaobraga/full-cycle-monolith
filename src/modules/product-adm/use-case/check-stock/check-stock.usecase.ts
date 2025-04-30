import { ProductGateway } from '../../gateway/product.gateway'
import { CheckStockInputDTO, CheckStockOutputDTO } from './check-stock.dto'

export class CheckStockUseCase {
  constructor(private readonly productRepository: ProductGateway) {}

  async execute(input: CheckStockInputDTO): Promise<CheckStockOutputDTO> {
    const product = await this.productRepository.find(input.productId)

    return {
      productId: product.id.id,
      stock: product.stock
    }
  }
}
