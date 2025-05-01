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
      address: client.address,
      createdAt: new Date(),
      updatedAt: new Date()
    })
  }

  async find(id: string): Promise<Client> {
    const product = await ClientModel.findOne({
      where: { id }
    })

    if (!product) {
      throw new Error('CLient not found')
    }

    return new Client({
      id: new Id(product.id),
      name: product.name,
      email: product.email,
      address: product.address
    })
  }
}
