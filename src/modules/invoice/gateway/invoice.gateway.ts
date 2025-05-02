import { Invoice } from '../domain/invoice.entity'

export interface InvoiceGateway {
  find(id: string): Promise<Invoice>
  create(invoice: Invoice): Promise<void>
}
