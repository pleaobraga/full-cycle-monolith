import { Id } from '../../@shared/domain/value-object/id.value-object'
import { Client } from '../domain/client.entity'
import { ClientGateway } from '../gateway/client.gateway'
import { ClientModel } from './client.model'

export class ClientRepository implements ClientGateway {
  async add(client: Client): Promise<void> {
    await ClientModel.create({
      id: client.id.id,
      name: client.name,
      email: client.email,
      street: client.address.street,
      number: client.address.number,
      complement: client.address.complement,
      city: client.address.city,
      state: client.address.state,
      zipCode: client.address.zipCode,
      createdAt: new Date(),
      updatedAt: new Date()
    })
  }

  async find(id: string): Promise<Client> {
    const client = await ClientModel.findOne({
      where: { id }
    })

    if (!client) {
      throw new Error('Client not found')
    }

    return new Client({
      id: new Id(client.id),
      name: client.name,
      email: client.email,
      street: client.street,
      number: client.number,
      complement: client.complement,
      city: client.city,
      state: client.state,
      zipCode: client.zipCode
    })
  }
}
