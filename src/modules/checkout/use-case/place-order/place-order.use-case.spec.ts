import { ClientAdmFacadeInterface } from '../../../client-adm/facade/client-adm.facade.interface'
import { ProductAdmFacadeInterface } from '../../../product-adm/facade/product-adm.facade.interface'
import { StoreCatalogFacadeInterface } from '../../../store-catalog/facade/store-catalog.facade.interface'
import { PlaceOrderUseCase } from './place-order.use-case'

const mockClientFacade: ClientAdmFacadeInterface = {
  find: jest.fn().mockResolvedValue({ id: '123', name: 'Client Test' }),
  add: jest.fn()
}

const mockProductFacade: ProductAdmFacadeInterface = {
  addProduct: jest.fn(),
  checkStock: jest.fn().mockResolvedValue({ productId: '1', stock: 2 })
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

describe('Place Order Use Case', () => {
  describe('validateProducts method', () => {
    it('should throw an error if no products are selected', async () => {
      const placeOrderUseCase = new PlaceOrderUseCase(
        mockClientFacade,
        mockProductFacade,
        mockStoreCatalogFacade
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
        mockStoreCatalogFacade
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
        mockStoreCatalogFacade
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
        mockStoreCatalogFacade
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
        mockStoreCatalogFacade
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
    })
  })

  describe('execute method', () => {
    it('should throw an error if the client is not found', async () => {
      const mockClientFacade: ClientAdmFacadeInterface = {
        find: jest.fn().mockResolvedValue(null),
        add: jest.fn()
      }

      const placeOrderUseCase = new PlaceOrderUseCase(
        mockClientFacade,
        mockProductFacade,
        mockStoreCatalogFacade
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
        mockStoreCatalogFacade
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
  })
})
