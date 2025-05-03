import { ClientAdmFacadeInterface } from '../../../client-adm/facade/client-adm.facade.interface'
import { InvoiceFacadeInterface } from '../../../invoice/facade/invoice.facade.interface'
import PaymentFacadeInterface from '../../../payment/facade/facade.interface'
import { ProductAdmFacadeInterface } from '../../../product-adm/facade/product-adm.facade.interface'
import { StoreCatalogFacadeInterface } from '../../../store-catalog/facade/store-catalog.facade.interface'
import { PlaceOrderInputDTO } from './place-order.dto'
import { PlaceOrderUseCase } from './place-order.use-case'

const mockClientFacade: ClientAdmFacadeInterface = {
  find: jest.fn().mockResolvedValue({ id: '123', name: 'Client Test' }),
  add: jest.fn()
}

const mockProductFacade: ProductAdmFacadeInterface = {
  addProduct: jest.fn(),
  checkStock: jest.fn().mockResolvedValue({ productId: '1', stock: 2 })
}

const mockPaymentFacade: PaymentFacadeInterface = {
  process: jest.fn().mockResolvedValue({
    id: '1',
    orderId: '1',
    status: 'approved',
    invoiceId: '1',
    total: 200
  })
}

const mockInvoiceFacade: InvoiceFacadeInterface = {
  generate: jest.fn().mockResolvedValue({
    id: '1',
    name: 'Client Test',
    document: '123456789',
    address: {
      street: 'Street Test',
      number: '123',
      complement: 'Complement Test',
      city: 'City Test',
      state: 'State Test',
      zipCode: 'ZipCode Test'
    },
    items: [
      {
        id: '1',
        name: 'Product 1',
        price: 100
      },

      {
        id: '2',
        name: 'Product 2',
        price: 200
      }
    ],
    total: 300,
    createdAt: new Date('2023-01-01')
  }),
  find: jest.fn()
}

const mockStoreCatalogFacade: StoreCatalogFacadeInterface = {
  find: jest.fn().mockResolvedValue({
    id: '1',
    name: 'Product 1',
    description: 'Description 1',
    salesPrice: 100
  }),
  findAll: jest.fn().mockResolvedValue({
    products: [
      {
        id: '1',
        name: 'Product 1',
        description: 'Description 1',
        salesPrice: 100
      },
      {
        id: '2',
        name: 'Product 2',
        description: 'Description 2',
        salesPrice: 200
      }
    ]
  })
}

const mockCheckoutRepository = {
  addOrder: jest.fn(),
  findOrder: jest.fn()
}

describe('Place Order Use Case', () => {
  describe('validateProducts method', () => {
    it('should throw an error if no products are selected', async () => {
      const placeOrderUseCase = new PlaceOrderUseCase(
        mockClientFacade,
        mockProductFacade,
        mockStoreCatalogFacade,
        mockPaymentFacade,
        mockInvoiceFacade,
        mockCheckoutRepository
      )

      const input = {
        clientId: '123',
        products: []
      }

      await expect(
        (placeOrderUseCase as any).validateProducts(input.products)
      ).rejects.toThrow(new Error('No product selected'))
    })

    it('should throw an error if products is out of stock', async () => {
      const mockProductFacade: ProductAdmFacadeInterface = {
        addProduct: jest.fn(),
        checkStock: jest.fn().mockResolvedValue({ productId: '1', stock: 0 })
      }

      const placeOrderUseCase = new PlaceOrderUseCase(
        mockClientFacade,
        mockProductFacade,
        mockStoreCatalogFacade,
        mockPaymentFacade,
        mockInvoiceFacade,
        mockCheckoutRepository
      )

      const input = {
        clientId: '123',
        products: [{ productId: '1' }, { productId: '2' }]
      }

      const mockValidateProducts = jest
        .spyOn(placeOrderUseCase as any, 'validateProducts')
        .mockRejectedValue(new Error('Product out of stock'))

      await expect(
        (placeOrderUseCase as any).validateProducts(input.products)
      ).rejects.toThrow(new Error('Product out of stock'))

      expect(mockValidateProducts).toHaveBeenCalledTimes(1)
    })

    it('should not throw an error if products are valid', async () => {
      const placeOrderUseCase = new PlaceOrderUseCase(
        mockClientFacade,
        mockProductFacade,
        mockStoreCatalogFacade,
        mockPaymentFacade,
        mockInvoiceFacade,
        mockCheckoutRepository
      )

      const input = {
        clientId: '123',
        products: [{ productId: '1' }, { productId: '2' }]
      }

      await expect(
        (placeOrderUseCase as any).validateProducts(input.products)
      ).resolves.not.toThrow()
    })
  })

  describe('getProducts method', () => {
    beforeAll(() => {
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2023-01-01'))
    })

    afterAll(() => {
      jest.useRealTimers()
    })

    it('should throw an error if the product is not found', async () => {
      const mockStoreCatalogFacade: StoreCatalogFacadeInterface = {
        find: jest.fn().mockResolvedValue(null),
        findAll: jest.fn()
      }

      const placeOrderUseCase = new PlaceOrderUseCase(
        mockClientFacade,
        mockProductFacade,
        mockStoreCatalogFacade,
        mockPaymentFacade,
        mockInvoiceFacade,
        mockCheckoutRepository
      )

      const input = {
        clientId: '123',
        products: [{ productId: '1' }, { productId: '2' }]
      }

      await expect(
        (placeOrderUseCase as any).getProduct(input.products)
      ).rejects.toThrow(new Error('Product not found'))
    })

    it('should return the product if found', async () => {
      const placeOrderUseCase = new PlaceOrderUseCase(
        mockClientFacade,
        mockProductFacade,
        mockStoreCatalogFacade,
        mockPaymentFacade,
        mockInvoiceFacade,
        mockCheckoutRepository
      )

      const input = {
        clientId: '123',
        products: [{ productId: '1' }, { productId: '2' }]
      }

      const product = await (placeOrderUseCase as any).getProduct(
        input.products[0].productId
      )

      expect(product.id.id).toBe('1')
      expect(product.name).toBe('Product 1')
      expect(product.description).toBe('Description 1')
      expect(product.salesPrice).toBe(100)
      expect(mockStoreCatalogFacade.find).toHaveBeenCalled()
    })
  })

  describe('execute method', () => {
    beforeAll(() => {
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2023-01-01'))
    })

    afterAll(() => {
      jest.useRealTimers()
    })
    it('should throw an error if the client is not found', async () => {
      const mockClientFacade: ClientAdmFacadeInterface = {
        find: jest.fn().mockResolvedValue(null),
        add: jest.fn()
      }

      const placeOrderUseCase = new PlaceOrderUseCase(
        mockClientFacade,
        mockProductFacade,
        mockStoreCatalogFacade,
        mockPaymentFacade,
        mockInvoiceFacade,
        mockCheckoutRepository
      )

      const input = {
        clientId: '123',
        products: [{ productId: '1' }, { productId: '2' }]
      }
      await expect(placeOrderUseCase.execute(input)).rejects.toThrow(
        new Error('Client not found')
      )
    })

    it('should throw an error if the products are not valid', async () => {
      const placeOrderUseCase = new PlaceOrderUseCase(
        mockClientFacade,
        mockProductFacade,
        mockStoreCatalogFacade,
        mockPaymentFacade,
        mockInvoiceFacade,
        mockCheckoutRepository
      )

      const mockValidateProducts = jest
        .spyOn(placeOrderUseCase as any, 'validateProducts')
        .mockRejectedValue(new Error('No product selected'))

      const input = {
        clientId: '123',
        products: []
      }

      await expect(placeOrderUseCase.execute(input)).rejects.toThrow(
        new Error('No product selected')
      )

      expect(mockValidateProducts).toHaveBeenCalledTimes(1)
    })

    describe('Place order', () => {
      const clientProps = {
        id: '123',
        name: 'Client Test',
        document: '123456789',
        email: 'test@123',
        street: 'Street Test',
        number: '123',
        complement: 'Complement Test',
        city: 'City Test',
        state: 'State Test',
        zipCode: 'ZipCode Test'
      }

      const mockClientFacade = {
        find: jest.fn().mockResolvedValue({
          id: clientProps.id,
          name: clientProps.name,
          document: clientProps.document,
          email: clientProps.email,
          street: clientProps.street,
          number: clientProps.number,
          complement: clientProps.complement,
          city: clientProps.city,
          state: clientProps.state,
          zipCode: clientProps.zipCode
        }),
        add: jest.fn()
      }

      it('should not be approved', async () => {
        const mockPaymentFacade: PaymentFacadeInterface = {
          process: jest.fn().mockResolvedValue({
            id: '1',
            orderId: '1',
            status: 'error',
            invoiceId: '1',
            total: 200
          })
        }

        const placeOrderUseCase = new PlaceOrderUseCase(
          mockClientFacade,
          mockProductFacade,
          mockStoreCatalogFacade,
          mockPaymentFacade,
          mockInvoiceFacade,
          mockCheckoutRepository
        )

        const input: PlaceOrderInputDTO = {
          clientId: '123',
          products: [
            {
              productId: '1'
            },
            {
              productId: '2'
            }
          ]
        }

        const output = await placeOrderUseCase.execute(input)

        expect(output.invoiceId).toBe(null)
        expect(output.total).toBe(200)
        expect(mockClientFacade.find).toHaveBeenCalledTimes(1)
        expect(mockClientFacade.find).toHaveBeenCalledWith({ id: '123' })
        expect(mockCheckoutRepository.addOrder).toHaveBeenCalled()
        expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1)
        expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(0)
      })

      it('should be approved', async () => {
        const placeOrderUseCase = new PlaceOrderUseCase(
          mockClientFacade,
          mockProductFacade,
          mockStoreCatalogFacade,
          mockPaymentFacade,
          mockInvoiceFacade,
          mockCheckoutRepository
        )

        const input: PlaceOrderInputDTO = {
          clientId: '123',
          products: [
            {
              productId: '1'
            },
            {
              productId: '2'
            }
          ]
        }

        const output = await placeOrderUseCase.execute(input)

        console.log('output', output)

        expect(output.invoiceId).toBe('1')
        expect(output.total).toBe(200)
        expect(mockClientFacade.find).toHaveBeenCalledWith({ id: '123' })
        expect(mockCheckoutRepository.addOrder).toHaveBeenCalled()
        expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1)
        expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(1)
        expect(output).toEqual({
          id: expect.any(String),
          invoiceId: '1',
          status: 'approved',
          total: 200,
          products: [{ productId: '1' }, { productId: '1' }]
        })
      })
    })
  })
})
