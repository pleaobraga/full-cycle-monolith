import { Address } from '../../../@shared/domain/value-object/adress.value-object'
import { Id } from '../../../@shared/domain/value-object/id.value-object'
import { Invoice } from '../../domain/invoice.entity'
import { FindInvoiceUseCaseInputDTO } from './find-invoice.dto'
import { FindInvoiceUseCase } from './find-invoice.use-case'

const invoice = new Invoice({
  id: new Id('1'),
  name: 'John Doe',
  document: '123456789',
  address: new Address('Street 1', 123, 'Apt 4', 'City', 'State', '12345-678'),
  items: [
    { id: new Id('item-1'), name: 'Product A', price: 100 },
    { id: new Id('item-2'), name: 'Product B', price: 200 }
  ],
  createdAt: new Date(),
  updatedAt: new Date()
})

describe('GenerateInvoiceUseCase', () => {
  it('should find an invoice', async () => {
    const invoiceRepository = {
      find: jest.fn().mockResolvedValue(Promise.resolve(invoice)),
      create: jest.fn()
    }

    const useCase = new FindInvoiceUseCase(invoiceRepository)

    const input: FindInvoiceUseCaseInputDTO = {
      id: '1'
    }

    const output = await useCase.execute(input)

    expect(output).toEqual({
      id: expect.any(String),
      name: 'John Doe',
      document: '123456789',
      address: {
        street: 'Street 1',
        number: 123,
        complement: 'Apt 4',
        city: 'City',
        state: 'State',
        zipCode: '12345-678'
      },
      items: [
        { id: 'item-1', name: 'Product A', price: 100 },
        { id: 'item-2', name: 'Product B', price: 200 }
      ],
      createdAt: expect.any(Date),
      total: 300
    })

    expect(invoiceRepository.find).toHaveBeenCalled()
  })
})
