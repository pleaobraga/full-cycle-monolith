import { Sequelize } from 'sequelize-typescript'
import { ProductModel } from './product.model'
import { ProductRepository } from './product.repository'
import { Product } from '../domain/product.entity'
import { Id } from '../../@shared/domain/value-object/id.value-object'

let sequelize: Sequelize
describe('Product Repository', () => {
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

  it('should create a product', async () => {
    const productProps = {
      id: new Id(),
      name: 'Product 1',
      description: 'Description 1',
      purchasePrice: 100,
      stock: 10
    }

    const product = new Product(productProps)

    const productRepository = new ProductRepository()
    await productRepository.add(product)

    const productdb = await ProductModel.findOne({
      where: { id: product.id.id }
    })

    expect(productdb).toBeDefined()
    expect(productdb?.id).toBe(product.id.id)
    expect(productdb?.name).toBe(product.name)
    expect(productdb?.description).toBe(product.description)
    expect(productdb?.purchasePrice).toBe(product.purchasePrice)
    expect(productdb?.stock).toBe(product.stock)
  })

  it('should find a product', async () => {
    const productProps = {
      id: new Id(),
      name: 'Product 1',
      description: 'Description 1',
      purchasePrice: 100,
      stock: 10
    }

    const product = new Product(productProps)

    const productRepository = new ProductRepository()
    await productRepository.add(product)

    const foundProduct = await productRepository.find(product.id.id)

    expect(foundProduct).toBeDefined()
    expect(foundProduct.id.id).toBe(product.id.id)
    expect(foundProduct.name).toBe(product.name)
    expect(foundProduct.description).toBe(product.description)
    expect(foundProduct.purchasePrice).toBe(product.purchasePrice)
    expect(foundProduct.stock).toBe(product.stock)
  })
})
