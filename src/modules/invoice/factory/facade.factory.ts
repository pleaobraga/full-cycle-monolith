import { InvoiceFacade } from '../facade/invoice.facade'
import { InvoiceRepository } from '../repository/invoice.repository'
import { FindInvoiceUseCase } from '../use-case/find-invoice/find-invoice.use-case'
import { GenerateInvoiceUseCase } from '../use-case/generate-invoice/generate-invoice.use-case'

export class InvoiceFacadeFactory {
  static create() {
    const invoiceRepository = new InvoiceRepository()
    const generateInvoiceUseCase = new GenerateInvoiceUseCase(invoiceRepository)
    const findInvoiceUseCase = new FindInvoiceUseCase(invoiceRepository)

    const invoiceFacade = new InvoiceFacade({
      generateUseCase: generateInvoiceUseCase,
      findUseCase: findInvoiceUseCase
    })

    return invoiceFacade
  }
}
