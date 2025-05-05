import { UsecaseInterface } from '../../../@shared/use-case/use-case.interface'
import { ClientGateway } from '../../gateway/client.gateway'
import { FindClientInputDTO, FindClientOutputDTO } from './find-client'

export class FindClientUseCase implements UsecaseInterface {
  constructor(private readonly clientGateway: ClientGateway) {}

  async execute(input: FindClientInputDTO): Promise<FindClientOutputDTO> {
    const client = await this.clientGateway.find(input.id)

    return {
      id: client.id.id,
      name: client.name,
      email: client.email,
      street: client.address.street,
      number: client.address.number,
      complement: client.address.complement,
      city: client.address.city,
      state: client.address.state,
      zipCode: client.address.zipCode
    }
  }
}
