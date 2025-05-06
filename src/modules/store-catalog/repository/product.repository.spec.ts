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

  it('should list all product', async () => {
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

    const productRepository = new ProductRepository()
    const products = await productRepository.findAll()

    expect(products).toHaveLength(2)
    expect(products[0].id.id).toBe('1')
    expect(products[0].name).toBe('Product 1')
    expect(products[0].description).toBe('Description 1')
    expect(products[0].salesPrice).toBe(100)
    expect(products[1].id.id).toBe('2')
    expect(products[1].name).toBe('Product 2')
    expect(products[1].description).toBe('Description 2')
    expect(products[1].salesPrice).toBe(200)
  })

  it('should find a product', async () => {
    await ProductModel.create({
      id: '1',
      name: 'Product 1',
      description: 'Description 1',
      salesPrice: 100
    })

    const productRepository = new ProductRepository()

    const foundProduct = await productRepository.find('1')

    expect(foundProduct).toBeDefined()
    expect(foundProduct.id.id).toBe('1')
    expect(foundProduct.name).toBe('Product 1')
    expect(foundProduct.description).toBe('Description 1')
    expect(foundProduct.salesPrice).toBe(100)
  })

  it('should upsert a product', async () => {
    const productRepository = new ProductRepository()

    const productData = {
      id: new Id('1'),
      name: 'Product 1',
      description: 'Initial Description',
      salesPrice: 100
    }

    const product = new Product(productData)

    // First: create (no product exists yet)
    await productRepository.upsert(product)

    let created = await ProductModel.findByPk('1')
    expect(created).toBeDefined()
    expect(created?.name).toBe('Product 1')
    expect(created?.description).toBe('Initial Description')
    expect(created?.salesPrice).toBe(100)

    // Second: update (product already exists)
    const updatedData = {
      ...productData,
      name: 'Updated Product 1',
      description: 'Updated Description',
      salesPrice: 150
    }

    const updatedProduct = new Product(updatedData)

    await productRepository.upsert(updatedProduct)

    const updated = await ProductModel.findByPk('1')
    expect(updated?.name).toBe('Updated Product 1')
    expect(updated?.description).toBe('Updated Description')
    expect(updated?.salesPrice).toBe(150)
  })
})
