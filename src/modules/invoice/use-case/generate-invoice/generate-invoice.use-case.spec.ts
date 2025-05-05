import { GenerateInvoiceUseCaseInputDto } from "./generate-invoice.dto"
import { GenerateInvoiceUseCase } from "./generate-invoice.use-case"

describe('GenerateInvoiceUseCase', () => {
  it('should generate an invoice', async () => {
    const invoiceRepository = {
      create: jest.fn(),
      find: jest.fn()
    }

    const useCase = new GenerateInvoiceUseCase(invoiceRepository)

    const input: GenerateInvoiceUseCaseInputDto = {
      name: 'John Doe',
      document: '123456789',
      street: 'Street 1',
      number: 123,
      complement: 'Apt 4',
      city: 'City',
      state: 'State',
      zipCode: '12345-678',
      items: [
        { id: 'item-1', name: 'Product A', price: 100 },
        { id: 'item-2', name: 'Product B', price: 200 }
      ]
    }

    const output = await useCase.execute(input)

    expect(output).toEqual({
      id: expect.any(String),
      name: input.name,
      document: input.document,
      street: input.street,
      number: input.number,
      complement: input.complement,
      city: input.city,
      state: input.state,
      zipCode: input.zipCode,
      items: [
        { id: input.items[0].id, name: input.items[0].name, price: 100 },
        { id: input.items[1].id, name: input.items[1].name, price: 200 }
      ],
      total: 300
    })

    expect(invoiceRepository.create).toHaveBeenCalled()
  })
})
