import { Id } from '../../../../@shared/domain/value-object/id.value-object'
import { Client } from '../../../domain/client.entity'
import { FindClienttUseCase } from './find-client.usecase'

const client = new Client({
  id: new Id('1'),
  name: 'Product 1',
  email: 'email',
  address: 'address'
})

const mockRepository = {
  find: jest.fn().mockReturnValue(Promise.resolve(client)),
  add: jest.fn()
}

describe('Find Client UseCase unit test', () => {
  it('should find client', async () => {
    const clientRepository = mockRepository
    const findClientUseCase = new FindClienttUseCase(clientRepository)

    const input = {
      id: '1'
    }

    const result = await findClientUseCase.execute(input)

    expect(clientRepository.find).toHaveBeenCalled()
    expect(clientRepository.find).toHaveBeenCalledWith(input.id)
    expect(result).toEqual({
      id: '1',
      name: 'Product 1',
      email: 'email',
      address: 'address'
    })
  })
})
