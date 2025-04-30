import { Sequelize } from 'sequelize-typescript'
import { ProductModel } from './product.model'
import { ProductRepository } from './product.repository'

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

  // it('should find a product', async () => {
  //   const productProps = {
  //     id: new Id(),
  //     name: 'Product 1',
  //     description: 'Description 1',
  //     purchasePrice: 100,
  //     stock: 10
  //   }

  //   const product = new Product(productProps)

  //   const productRepository = new ProductRepository()
  //   await productRepository.add(product)

  //   const foundProduct = await productRepository.find(product.id.id)

  //   expect(foundProduct).toBeDefined()
  //   expect(foundProduct.id.id).toBe(product.id.id)
  //   expect(foundProduct.name).toBe(product.name)
  //   expect(foundProduct.description).toBe(product.description)
  //   expect(foundProduct.purchasePrice).toBe(product.purchasePrice)
  //   expect(foundProduct.stock).toBe(product.stock)
  // })
})
