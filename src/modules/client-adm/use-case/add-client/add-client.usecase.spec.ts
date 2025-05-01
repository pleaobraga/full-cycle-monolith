import { Id } from '../../../@shared/domain/value-object/id.value-object'
import { AddClientUseCase } from './add-client.usecase'

const mockRepository = {
  find: jest.fn(),
  add: jest.fn()
}

describe('Add Client UseCase unit test', () => {
  it('should add client', async () => {
    const productRepository = mockRepository
    const addCLientProductsUseCase = new AddClientUseCase(productRepository)

    const input = {
      id: '1',
      name: 'Product 1',
      email: 'test@123.com',
      address: 'Address 1'
    }

    const result = await addCLientProductsUseCase.execute(input)

    expect(productRepository.add).toHaveBeenCalled()

    expect(result).toEqual({
      id: expect.any(String),
      name: 'Product 1',
      email: 'test@123.com',
      address: 'Address 1',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    })
  })
})
