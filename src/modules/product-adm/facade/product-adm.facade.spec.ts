import { Sequelize } from 'sequelize-typescript'
import { ProductModel } from '../repository/product.model'
import { Id } from '../../@shared/domain/value-object/id.value-object'
import { ProductRepository } from '../repository/product.repository'
import { Product } from '../domain/product.entity'
import { ProductAdmFacade } from './product-adm.facade'
import { UsecaseInterface } from '../../@shared/use-case/use-case.interface'
import { AddProductUseCase } from '../use-case/add-product.usecase'

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
    const productRepository = new ProductRepository()
    const addProductUseCase = new AddProductUseCase(productRepository)

    const mockUsecase: UsecaseInterface = {
      execute: jest.fn()
    }

    const productAdmFacade = new ProductAdmFacade({
      addUseCase: addProductUseCase,
      checkStockUseCase: mockUsecase
    })

    const input = {
      id: '1',
      name: 'Product 1',
      description: 'Description 1',
      purchasePrice: 100,
      stock: 10
    }

    await productAdmFacade.addProduct(input)

    const product = await productRepository.find(input.id)
    expect(product).toBeDefined()
    expect(product.id.id).toBe(input.id)
    expect(product.name).toBe(input.name)
    expect(product.description).toBe(input.description)
    expect(product.purchasePrice).toBe(input.purchasePrice)
    expect(product.stock).toBe(input.stock)
  })
})
