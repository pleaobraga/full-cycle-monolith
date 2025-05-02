import { UsecaseInterface } from '../../@shared/use-case/use-case.interface'
import {
  FindInvoiceFacadeInputDto,
  FindInvoiceOutputDto,
  GenerateInvoiceFacadeInputDto,
  GenerateInvoiceFacadeOutputDto,
  InvoiceFacadeInterface
} from './invoice.facade.interface'

interface InvoiceFacadeProps {
  findUseCase: UsecaseInterface
  generateUseCase: UsecaseInterface
}

export class InvoiceFacade implements InvoiceFacadeInterface {
  private readonly _findUseCase: UsecaseInterface
  private readonly _generateUseCase: UsecaseInterface

  constructor(props: InvoiceFacadeProps) {
    this._findUseCase = props.findUseCase
    this._generateUseCase = props.generateUseCase
  }

  async find(input: FindInvoiceFacadeInputDto): Promise<FindInvoiceOutputDto> {
    return this._findUseCase.execute(input)
  }

  async generate(
    input: GenerateInvoiceFacadeInputDto
  ): Promise<GenerateInvoiceFacadeOutputDto> {
    return this._generateUseCase.execute(input)
  }
}
