import { Client } from '../domain/client.entity'

export interface ClientGateway {
  add(client: Client): Promise<Client>
  find(id: string): Promise<Client>
}
