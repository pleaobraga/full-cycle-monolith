import { UsecaseInterface } from '../../../@shared/use-case/use-case.interface'
import { InvoiceGateway } from '../../gateway/invoice.gateway'
import {
  FindInvoiceUseCaseInputDTO,
  FindInvoiceUseCaseOutputDTO
} from './find-invoice.dto'

export class FindInvoiceUseCase implements UsecaseInterface {
  constructor(private readonly invoiceRepository: InvoiceGateway) {}

  async execute(
    input: FindInvoiceUseCaseInputDTO
  ): Promise<FindInvoiceUseCaseOutputDTO> {
    const invoice = await this.invoiceRepository.find(input.id)

    return {
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      address: {
        street: invoice.address.street,
        number: invoice.address.number,
        complement: invoice.address.complement,
        city: invoice.address.city,
        state: invoice.address.state,
        zipCode: invoice.address.zipCode
      },
      items: invoice.items.map((item) => ({
        id: item.id.id,
        name: item.name,
        price: item.price
      })),
      createdAt: invoice.createdAt,
      total: invoice.items.reduce((acc, item) => acc + item.price, 0)
    }
  }
}
