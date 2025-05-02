import { Address } from '../../../@shared/domain/value-object/adress.value-object'
import { Id } from '../../../@shared/domain/value-object/id.value-object'
import { UsecaseInterface } from '../../../@shared/use-case/use-case.interface'
import { Invoice } from '../../domain/invoice.entity'
import { InvoiceGateway } from '../../gateway/invoice.gateway'
import {
  GenerateInvoiceUseCaseInputDto,
  GenerateInvoiceUseCaseOutputDto
} from './generate-invoice.dto'

export class GenerateInvoiceUseCase implements UsecaseInterface {
  constructor(private readonly invoiceRepository: InvoiceGateway) {}

  async execute(
    input: GenerateInvoiceUseCaseInputDto
  ): Promise<GenerateInvoiceUseCaseOutputDto> {
    const invoice = new Invoice({
      name: input.name,
      document: input.document,
      address: new Address(
        input.street,
        input.number,
        input.complement,
        input.city,
        input.state,
        input.zipCode
      ),
      items: input.items.map((item) => ({
        id: new Id(item.id),
        name: item.name,
        price: item.price
      })),
      createdAt: new Date(),
      updatedAt: new Date()
    })

    await this.invoiceRepository.create(invoice)

    const total = invoice.items.reduce((acc, item) => acc + item.price, 0)

    return {
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      street: invoice.address.street,
      number: invoice.address.number,
      complement: invoice.address.complement,
      city: invoice.address.city,
      state: invoice.address.state,
      zipCode: invoice.address.zipCode,
      items: invoice.items.map((item) => ({
        id: item.id.id,
        name: item.name,
        price: item.price
      })),
      total
    }
  }
}
