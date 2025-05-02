import { Sequelize } from 'sequelize-typescript'
import { InvoiceModel } from './invoice.model'
import { InvoiceRepository } from './invoice.repository'
import { InvoiceItemModel } from './invoice-item.model'
import { Invoice } from '../domain/invoice.entity'
import { Id } from '../../@shared/domain/value-object/id.value-object'
import { Address } from '../../@shared/domain/value-object/adress.value-object'

describe('Invoice Repository', () => {
  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    })

    await sequelize.addModels([InvoiceModel, InvoiceItemModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it('should generate an invoice with items', async () => {
    const repo = new InvoiceRepository()

    const invoice = new Invoice({
      id: new Id('inv-1'),
      name: 'John Doe',
      document: '123456789',
      address: new Address(
        'Street 1',
        '123',
        'Apt 4',
        'City',
        'State',
        '12345-678'
      ),
      items: [
        { id: new Id('item-1'), name: 'Product A', price: 100 },
        { id: new Id('item-2'), name: 'Product B', price: 200 }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    })

    await repo.generate(invoice)

    const dbInvoice = await InvoiceModel.findOne({
      where: { id: 'inv-1' },
      include: [InvoiceItemModel]
    }) as InvoiceModel

    expect(dbInvoice).toBeTruthy()
    expect(dbInvoice.id).toBe('inv-1')
    expect(dbInvoice.name).toBe('John Doe')
    expect(dbInvoice.document).toBe('123456789')
    expect(dbInvoice.street).toBe('Street 1')
    expect(dbInvoice.number).toBe('123')
    expect(dbInvoice.complement).toBe('Apt 4')
    expect(dbInvoice.city).toBe('City')
    expect(dbInvoice.state).toBe('State')
    expect(dbInvoice.zipCode).toBe('12345-678')
    expect(dbInvoice.createdAt).toBeInstanceOf(Date)
    expect(dbInvoice.updatedAt).toBeInstanceOf(Date)
    expect(dbInvoice.items).toBeTruthy()
    expect(dbInvoice.items.length).toBe(2)
    expect(dbInvoice.items[0].name).toBe('Product A')
    expect(dbInvoice.items[0].price).toBe(100)
    expect(dbInvoice.items[1].name).toBe('Product B')
    expect(dbInvoice.items[1].price).toBe(200)
  })

  it('should find an invoice', async () => {
    const invoiceRepository = new InvoiceRepository()
    await InvoiceModel.create({
      id: '1',
      name: 'Invoice 1',
      document: 'document',
      street: 'street',
      number: 'number',
      complement: 'complement',
      city: 'city',
      state: 'state',
      zipCode: 'zipCode',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const output = await invoiceRepository.find('1')

    expect(output.document).toBe('document')
    expect(output.name).toBe('Invoice 1')
    expect(output.id.id).toBe('1')
    expect(output.items).toEqual([])
    expect(output.address.street).toBe('street')
    expect(output.address.number).toBe('number')
    expect(output.address.complement).toBe('complement')
    expect(output.address.city).toBe('city')
    expect(output.address.state).toBe('state')
    expect(output.address.zipCode).toBe('zipCode')
    expect(output.createdAt).toBeInstanceOf(Date)
    expect(output.updatedAt).toBeInstanceOf(Date)
  })
})
