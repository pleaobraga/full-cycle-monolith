import { Id } from '../../../@shared/domain/value-object/id.value-object'
import { Client } from '../../domain/client.entity'
import { ClientGateway } from '../../gateway/client.gateway'
import { AddClientInputDTO, AddclientOutputDTO } from './add-client.dto'

export class AddClientUseCase {
  constructor(private readonly clientGateway: ClientGateway) {}

  async execute(input: AddClientInputDTO): Promise<AddclientOutputDTO> {
    const clientProps = {
      name: input.name,
      email: input.email,
      address: input.address
    }

    const client = new Client(clientProps)

    await this.clientGateway.add(client)

    return {
      id: client.id.id,
      name: client.name,
      email: client.email,
      address: client.address,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt
    }
  }
}
