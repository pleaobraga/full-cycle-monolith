import { Id } from '../../../@shared/domain/value-object/id.value-object'
import { Product } from '../../domain/product.entity'
import { FindProductUseCase } from './find-product.usecase'

const product1 = new Product({
  id: new Id('1'),
  name: 'Product 1',
  description: 'Description 1',
  salesPrice: 100
})

const mockRepository = {
  find: jest.fn().mockReturnValue(Promise.resolve(product1)),
  findAll: jest.fn()
}

describe('Find Product UseCase unit test', () => {
  it('should find product', async () => {
    const productRepository = mockRepository
    const findAllProductsUseCase = new FindProductUseCase(productRepository)

    const input = {
      productId: '1'
    }

    const result = await findAllProductsUseCase.execute(input)

    expect(productRepository.find).toHaveBeenCalled()
    expect(productRepository.find).toHaveBeenCalledWith(input.productId)
    expect(result).toEqual({
      id: '1',
      name: 'Product 1',
      description: 'Description 1',
      salesPrice: 100
    })
  })
})
