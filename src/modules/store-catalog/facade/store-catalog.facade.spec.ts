import { Sequelize } from 'sequelize-typescript'
import { ProductModel } from '../repository/product.model'
import { StoreCatalogFacadeFactory } from '../factory/facade.factory'

let sequelize: Sequelize
describe('Store Catalog Facade', () => {
  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    })

    await sequelize.addModels([ProductModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it('should find a product', async () => {
    const facade = StoreCatalogFacadeFactory.create()
    await ProductModel.create({
      id: '1',
      name: 'Product 1',
      description: 'Description 1',
      salesPrice: 100
    })

    const output = await facade.find({ id: '1' })

    expect(output).toEqual({
      id: '1',
      name: 'Product 1',
      description: 'Description 1',
      salesPrice: 100
    })
  })

  it('should find all products', async () => {
    const facade = StoreCatalogFacadeFactory.create()
    await ProductModel.create({
      id: '1',
      name: 'Product 1',
      description: 'Description 1',
      salesPrice: 100
    })

    await ProductModel.create({
      id: '2',
      name: 'Product 2',
      description: 'Description 2',
      salesPrice: 200
    })

    const output = await facade.findAll()

    expect(output).toEqual({
      products: [
        {
          id: '1',
          name: 'Product 1',
          description: 'Description 1',
          salesPrice: 100
        },
        {
          id: '2',
          name: 'Product 2',
          description: 'Description 2',
          salesPrice: 200
        }
      ]
    })
  })
})
