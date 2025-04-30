import { UsecaseInterface } from '../../@shared/use-case/use-case.interface'
import {
  FindAllStoreCatalogFacadeOutputDto,
  FindStoreCatalogFacadeInputDto,
  FindStoreCatalogOutputDto,
  StoreCatalogFacadeInterface
} from './store-catalog.facade.interface'

interface StoreCatalogFacadeProps {
  findUseCase: UsecaseInterface
  findAllUseCase: UsecaseInterface
}

export class StoreCatalogFacade implements StoreCatalogFacadeInterface {
  private readonly _findUseCase: UsecaseInterface
  private readonly _findAllUseCase: UsecaseInterface

  constructor(props: StoreCatalogFacadeProps) {
    this._findUseCase = props.findUseCase
    this._findAllUseCase = props.findAllUseCase
  }

  async find(
    input: FindStoreCatalogFacadeInputDto
  ): Promise<FindStoreCatalogOutputDto> {
    return this._findUseCase.execute(input)
  }

  async findAll(): Promise<FindAllStoreCatalogFacadeOutputDto> {
    return this._findAllUseCase.execute({})
  }
}
