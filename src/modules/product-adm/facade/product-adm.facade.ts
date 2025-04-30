import { UsecaseInterface } from '../../@shared/use-case/use-case.interface'
import {
  AddProductFacadeInputDto,
  CheckStockFacadeInputDto,
  CheckStockFacadeOutputDto,
  ProductAdmFacadeInterface
} from './product-adm.facade.interface'

interface ProductAdmFacadeProps {
  addUseCase: UsecaseInterface
  checkStockUseCase: UsecaseInterface
}

export class ProductAdmFacade implements ProductAdmFacadeInterface {
  private _addUseCase: UsecaseInterface
  private _checkStockUseCase: UsecaseInterface

  constructor(props: ProductAdmFacadeProps) {
    this._addUseCase = props.addUseCase
    this._checkStockUseCase = props.checkStockUseCase
  }

  async addProduct(input: AddProductFacadeInputDto): Promise<void> {
    return this._addUseCase.execute(input)
  }

  async checkStock(
    input: CheckStockFacadeInputDto
  ): Promise<CheckStockFacadeOutputDto> {
    return this._checkStockUseCase.execute(input)
  }
}
