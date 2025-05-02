import { Sequelize } from 'sequelize-typescript'
import { InvoiceModel } from './invoice.model'
import { InvoiceRepository } from './invoice.repository'
import { InvoiceItemModel } from './invoice-item.model'

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
