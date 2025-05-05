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
      name: 'Alice Smith',
      email: 'alice@example.com',
      street: 'Main St',
      number: 42,
      complement: 'Apt 5',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105'
    }

    const result = await addCLientProductsUseCase.execute(input)

    expect(productRepository.add).toHaveBeenCalled()

    expect(result).toEqual({
      id: expect.any(String),
      name: 'Alice Smith',
      email: 'alice@example.com',
      street: 'Main St',
      number: 42,
      complement: 'Apt 5',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    })
  })
})
