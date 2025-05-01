import { UsecaseInterface } from '../../../../@shared/use-case/use-case.interface'
import { ClientGateway } from '../../../gateway/client.gateway'
import { FindClientInputDTO, FindClientOutputDTO } from './find-client'

export class FindClienttUseCase implements UsecaseInterface {
  constructor(private readonly clienttGateway: ClientGateway) {}

  async execute(input: FindClientInputDTO): Promise<FindClientOutputDTO> {
    const client = await this.clienttGateway.find(input.id)

    return {
      id: client.id.id,
      name: client.name,
      email: client.email,
      address: client.address,
    }
  }
}
