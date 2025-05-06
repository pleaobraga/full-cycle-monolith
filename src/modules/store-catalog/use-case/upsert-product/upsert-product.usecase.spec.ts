import { UpsertProductUseCase } from './upsert-product.usecase'

const mockRepository = {
  findAll: jest.fn(),
  find: jest.fn(),
  upsert: jest.fn()
}

describe('Add Product UseCase unit test', () => {
  it('should add a product', async () => {
    const productRepository = mockRepository

    const addProductUseCase = new UpsertProductUseCase(productRepository)

    const input = {
      name: 'Product 1',
      description: 'Description 1',
      salesPrice: 100
    }

    await addProductUseCase.execute(input)

    expect(productRepository.upsert).toHaveBeenCalled()
  })
})
