import { AddProductUseCase } from './add-product.usecase'

const mockRepository = {
  add: jest.fn(),
  find: jest.fn()
}

describe('Add Product UseCase unit test', () => {
  it('should add a product', async () => {
    const productRepository = mockRepository

    const addProductUseCase = new AddProductUseCase(productRepository)

    const input = {
      name: 'Product 1',
      description: 'Description 1',
      purchasePrice: 100,
      stock: 10
    }

    const result = await addProductUseCase.execute(input)

    expect(productRepository.add).toHaveBeenCalled()
    expect(result).toEqual({
      id: expect.any(String),
      name: 'Product 1',
      description: 'Description 1',
      purchasePrice: 100,
      stock: 10,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    })
  })
})
