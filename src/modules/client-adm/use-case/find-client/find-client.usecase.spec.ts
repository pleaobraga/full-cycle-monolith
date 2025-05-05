import { Id } from '../../../@shared/domain/value-object/id.value-object'
import { Client } from '../../domain/client.entity'
import { FindClientUseCase } from './find-client.usecase'

const client = new Client({
  id: new Id('1'),
  name: 'Alice Smith',
  email: 'alice@example.com',
  street: 'Main St',
  number: 42,
  complement: 'Apt 5',
  city: 'San Francisco',
  state: 'CA',
  zipCode: '94105'
})

const mockRepository = {
  find: jest.fn().mockReturnValue(Promise.resolve(client)),
  add: jest.fn()
}

describe('Find Client UseCase unit test', () => {
  it('should find client', async () => {
    const clientRepository = mockRepository
    const findClientUseCase = new FindClientUseCase(clientRepository)

    const input = {
      id: '1'
    }

    const result = await findClientUseCase.execute(input)

    expect(clientRepository.find).toHaveBeenCalled()
    expect(clientRepository.find).toHaveBeenCalledWith(input.id)
    expect(result).toEqual({
      id: '1',
      name: 'Alice Smith',
      email: 'alice@example.com',
      street: 'Main St',
      number: 42,
      complement: 'Apt 5',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105'
    })
  })
})
