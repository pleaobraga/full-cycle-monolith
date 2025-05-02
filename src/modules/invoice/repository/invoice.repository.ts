import { Address } from '../../@shared/domain/value-object/adress.value-object'
import { Id } from '../../@shared/domain/value-object/id.value-object'
import { Invoice } from '../domain/invoice.entity'
import { InvoiceGateway } from '../gateway/invoice.gateway'
import { InvoiceItemModel } from './invoice-item.model'
import { InvoiceModel } from './invoice.model'

export class InvoiceRepository implements InvoiceGateway {
  async create(invoice: Invoice): Promise<void> {
    await InvoiceModel.create(
      {
        id: invoice.id.id,
        name: invoice.name,
        document: invoice.document,
        street: invoice.address.street,
        number: invoice.address.number,
        complement: invoice.address.complement,
        city: invoice.address.city,
        state: invoice.address.state,
        zipCode: invoice.address.zipCode,
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt,
        items: invoice.items.map((item) => ({
          id: item.id.id,
          name: item.name,
          price: item.price
        }))
      },
      {
        include: [InvoiceItemModel]
      }
    )
  }

  async find(id: string): Promise<Invoice> {
    const invoice = await InvoiceModel.findOne({
      where: { id },
      include: ['items']
    })

    if (!invoice) {
      throw new Error('Invoice not found')
    }

    const invoiceItems = invoice.items.map((item) => ({
      id: new Id(item.id),
      name: item.name,
      price: item.price
    }))

    return new Invoice({
      id: new Id(invoice.id),
      name: invoice.name,
      document: invoice.document,
      address: new Address(
        invoice.street,
        invoice.number,
        invoice.complement,
        invoice.city,
        invoice.state,
        invoice.zipCode
      ),
      items: invoiceItems,
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt
    })
  }
}
