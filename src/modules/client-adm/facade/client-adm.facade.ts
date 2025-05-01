import { UsecaseInterface } from '../../@shared/use-case/use-case.interface'
import {
  AddClientFacadeInputDto,
  ClientAdmFacadeInterface,
  FindClienOutputDto,
  FindClientFacadeInputDto
} from './client-adm.facade.interface'

interface StoreCatalogFacadeProps {
  findUseCase: UsecaseInterface
  addUseCase: UsecaseInterface
}

export class ClientAdmFacade implements ClientAdmFacadeInterface {
  private readonly _findUseCase: UsecaseInterface
  private readonly _addUseCase: UsecaseInterface

  constructor(props: StoreCatalogFacadeProps) {
    this._findUseCase = props.findUseCase
    this._addUseCase = props.addUseCase
  }

  async find(input: FindClientFacadeInputDto): Promise<FindClienOutputDto> {
    return this._findUseCase.execute(input)
  }

  async add(input: AddClientFacadeInputDto): Promise<void> {
    return this._addUseCase.execute(input)
  }
}
