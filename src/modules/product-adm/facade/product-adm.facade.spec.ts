import { Sequelize } from 'sequelize-typescript'
import { ProductModel } from '../repository/product.model'
import { ProductAdmFacadeFactory } from '../factory/facade.factory'

let sequelize: Sequelize
describe('Product Adm Facade', () => {
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

  it('should add a product', async () => {
    const productAdmFacade = ProductAdmFacadeFactory.create()

    const input = {
      id: '1',
      name: 'Product 1',
      description: 'Description 1',
      purchasePrice: 100,
      stock: 10
    }

    await productAdmFacade.addProduct(input)

    const product = (await ProductModel.findOne({
      where: { id: input.id }
    })) as ProductModel

    expect(product).toBeDefined()
    expect(product.id).toBe(input.id)
    expect(product.name).toBe(input.name)
    expect(product.description).toBe(input.description)
    expect(product.purchasePrice).toBe(input.purchasePrice)
    expect(product.stock).toBe(input.stock)
  })
})
