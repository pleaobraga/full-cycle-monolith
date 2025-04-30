import { Id } from '../../../@shared/domain/value-object/id.value-object'
import { Product } from '../../domain/product.entity'
import { CheckStockUseCase } from './check-stock.usecase'

const product = new Product({
  id: new Id('1'),
  name: 'Product 1',
  description: 'Description 1',
  purchasePrice: 100,
  stock: 10
})

const mockRepository = {
  add: jest.fn(),
  find: jest.fn().mockResolvedValue(Promise.resolve(product))
}

describe('Check Stock UseCase unit test', () => {
  it('should check stock', async () => {
    const checkStockUseCase = new CheckStockUseCase(mockRepository)

    const input = {
      productId: '1'
    }

    const result = await checkStockUseCase.execute(input)

    expect(mockRepository.find).toHaveBeenCalledWith(input.productId)
    expect(result).toEqual({
      productId: '1',
      stock: 10
    })
  })
})
