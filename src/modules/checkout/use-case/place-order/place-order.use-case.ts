import { UsecaseInterface } from '../../../@shared/use-case/use-case.interface'
import { PlaceOrderInputDTO, PlaceOrderOutputDTO } from './place-order.dto'

export class PlaceOrderUseCase implements UsecaseInterface {
  constructor() {}

  async execute(input: PlaceOrderInputDTO): Promise<PlaceOrderOutputDTO> {

    

    return {
      id: '1',
      invoiceId: '1',
      status: 'approved',
      total: 100,
      products: []
    }
  }
}
