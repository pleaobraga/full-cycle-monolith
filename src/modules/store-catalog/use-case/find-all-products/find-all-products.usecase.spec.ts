import { Id } from '../../../@shared/domain/value-object/id.value-object'
import { Product } from '../../domain/product.entity'
import { FindAllProductsUseCase } from './find-all-products.usecase'

const product1 = new Product({
  id: new Id('1'),
  name: 'Product 1',
  description: 'Description 1',
  salesPrice: 100
})

const product2 = new Product({
  id: new Id('2'),
  name: 'Product 2',
  description: 'Description 2',
  salesPrice: 100
})

const mockRepository = {
  find: jest.fn(),
  findAll: jest.fn().mockReturnValue(Promise.resolve([product1, product2])),
  upsert: jest.fn()
}

describe('Find All Products UseCase unit test', () => {
  it('should find all products', async () => {
    const productRepository = mockRepository
    const findAllProductsUseCase = new FindAllProductsUseCase(productRepository)

    const result = await findAllProductsUseCase.execute()

    expect(productRepository.findAll).toHaveBeenCalled()
    expect(result.products).toHaveLength(2)
    expect(result.products[0]).toEqual({
      id: '1',
      name: 'Product 1',
      description: 'Description 1',
      salesPrice: 100
    })
    expect(result.products[1]).toEqual({
      id: '2',
      name: 'Product 2',
      description: 'Description 2',
      salesPrice: 100
    })
  })
})
