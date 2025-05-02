import { Sequelize } from 'sequelize-typescript'
import { InvoiceModel } from '../repository/invoice.model'
import { InvoiceItemModel } from '../repository/invoice-item.model'
import { InvoiceFacadeFactory } from '../factory/facade.factory'

let sequelize: Sequelize
describe('Invoice Facade', () => {
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

  it('should find a invoice', async () => {
    const facade = InvoiceFacadeFactory.create()
    await InvoiceModel.create(
      {
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
        updatedAt: new Date(),
        items: [
          {
            id: '1',
            name: 'Item 1',
            price: 100
          }
        ]
      },
      {
        include: [InvoiceItemModel]
      }
    )

    const output = await facade.find({ id: '1' })

    expect(output).toEqual({
      id: '1',
      name: 'Invoice 1',
      document: 'document',
      address: {
        street: 'street',
        number: 'number',
        complement: 'complement',
        city: 'city',
        state: 'state',
        zipCode: 'zipCode'
      },
      items: [
        {
          id: '1',
          name: 'Item 1',
          price: 100
        }
      ],
      createdAt: expect.any(Date),
      total: 100
    })
  })

  it('should generate an invoice', async () => {
    const facade = InvoiceFacadeFactory.create()

    const input = {
      name: 'Invoice 1',
      document: 'document',
      street: 'street',
      number: 'number',
      complement: 'complement',
      city: 'city',
      state: 'state',
      zipCode: 'zipCode',
      items: [
        {
          id: '1',
          name: 'Item 1',
          price: 100
        }
      ]
    }

    const output = await facade.generate(input)

    expect(output).toEqual({
      id: expect.any(String),
      name: 'Invoice 1',
      document: 'document',
      street: 'street',
      number: 'number',
      complement: 'complement',
      city: 'city',
      state: 'state',
      zipCode: 'zipCode',
      items: [
        {
          id: '1',
          name: 'Item 1',
          price: 100
        }
      ],
      total: 100
    })
    
  })
})
