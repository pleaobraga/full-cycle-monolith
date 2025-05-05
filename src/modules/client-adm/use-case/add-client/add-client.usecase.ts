import { Id } from '../../../@shared/domain/value-object/id.value-object'
import { Client } from '../../domain/client.entity'
import { ClientGateway } from '../../gateway/client.gateway'
import { AddClientInputDTO, AddClientOutputDTO } from './add-client.dto'

export class AddClientUseCase {
  constructor(private readonly clientGateway: ClientGateway) {}

  async execute(input: AddClientInputDTO): Promise<AddClientOutputDTO> {
    const clientProps = {
      id: input.id ? new Id(input.id) : new Id(),
      name: input.name,
      email: input.email,
      street: input.street,
      number: input.number,
      complement: input.complement,
      city: input.city,
      state: input.state,
      zipCode: input.zipCode
    }

    const client = new Client(clientProps)

    await this.clientGateway.add(client)

    return {
      id: client.id.id,
      name: client.name,
      email: client.email,
      street: client.address.street,
      number: client.address.number,
      complement: client.address.complement,
      city: client.address.city,
      state: client.address.state,
      zipCode: client.address.zipCode,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt
    }
  }
}
