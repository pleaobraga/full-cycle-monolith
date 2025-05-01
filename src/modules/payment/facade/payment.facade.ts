import { UsecaseInterface } from "../../@shared/use-case/use-case.interface";
import PaymentFacadeInterface, {
  PaymentFacadeInputDto,
  PaymentFacadeOutputDto,
} from "./facade.interface";

export default class PaymentFacade implements PaymentFacadeInterface {
  constructor(private processPaymentUseCase: UsecaseInterface) {}
  process(input: PaymentFacadeInputDto): Promise<PaymentFacadeOutputDto> {
    return this.processPaymentUseCase.execute(input);
  }
}
