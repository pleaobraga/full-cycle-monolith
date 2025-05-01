import { UsecaseInterface } from "../../../@shared/use-case/use-case.interface";
import Transaction from "../../domain/transaction";
import PaymentGateway from "../../gateway/payment.gateway";
import {
  ProcessPaymentInputDto,
  ProcessPaymentOutputDto,
} from "./process-payment.dto";

export default class ProcessPaymentUseCase implements UsecaseInterface {
  constructor(private transactionRepository: PaymentGateway) {}

  async execute(
    input: ProcessPaymentInputDto
  ): Promise<ProcessPaymentOutputDto> {
    const transaction = new Transaction({
      amount: input.amount,
      orderId: input.orderId,
    });
    transaction.process();
    const persistTransaction = await this.transactionRepository.save(
      transaction
    );

    return {
      transactionId: persistTransaction.id.id,
      orderId: persistTransaction.orderId,
      amount: persistTransaction.amount,
      status: persistTransaction.status,
      createdAt: persistTransaction.createdAt,
      updatedAt: persistTransaction.updatedAt,
    };
  }
}
