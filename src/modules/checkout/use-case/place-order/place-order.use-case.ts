import { Id } from '../../../@shared/domain/value-object/id.value-object'
import { UsecaseInterface } from '../../../@shared/use-case/use-case.interface'
import { ClientAdmFacadeInterface } from '../../../client-adm/facade/client-adm.facade.interface'
import { ProductAdmFacadeInterface } from '../../../product-adm/facade/product-adm.facade.interface'
import { StoreCatalogFacadeInterface } from '../../../store-catalog/facade/store-catalog.facade.interface'
import { Product } from '../../domain/product.entity'
import { PlaceOrderInputDTO, PlaceOrderOutputDTO } from './place-order.dto'

export class PlaceOrderUseCase implements UsecaseInterface {
  private _clientFacade: ClientAdmFacadeInterface
  private _productFacade: ProductAdmFacadeInterface
  private _storeCatalogFacade: StoreCatalogFacadeInterface

  constructor(
    clientFacade: ClientAdmFacadeInterface,
    productFacade: ProductAdmFacadeInterface,
    storeCatalogFacade: StoreCatalogFacadeInterface
  ) {
    this._clientFacade = clientFacade
    this._productFacade = productFacade
    this._storeCatalogFacade = storeCatalogFacade
  }

  async execute(input: PlaceOrderInputDTO): Promise<PlaceOrderOutputDTO> {
    const client = await this._clientFacade.find({ id: input.clientId })
    if (!client) {
      throw new Error('Client not found')
    }

    await this.validateProducts(input.products)

    return {
      id: '1',
      invoiceId: '1',
      status: 'approved',
      total: 100,
      products: []
    }
  }

  private async validateProducts(
    products: { productId: string }[]
  ): Promise<void> {
    if (products.length === 0) {
      throw new Error('No product selected')
    }

    for (const product of products) {
      const stock = await this._productFacade.checkStock({
        productId: product.productId
      })
      if (stock.stock <= 0) {
        throw new Error('Product out of stock')
      }
    }

    // Add more validation logic here if needed
  }

  private async getProduct(productId: string): Promise<Product> {
    const product = await this._storeCatalogFacade.find({
      id: productId
    })

    if (!product) {
      throw new Error('Product not found')
    }

    return new Product({
      id: new Id(product.id),
      description: product.description,
      name: product.name,
      salesPrice: product.salesPrice
    })
  }
}
