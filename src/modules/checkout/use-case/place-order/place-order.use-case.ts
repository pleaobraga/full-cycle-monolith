import { Id } from '../../../@shared/domain/value-object/id.value-object'
import { UsecaseInterface } from '../../../@shared/use-case/use-case.interface'
import { ClientAdmFacadeInterface } from '../../../client-adm/facade/client-adm.facade.interface'
import { InvoiceFacadeInterface } from '../../../invoice/facade/invoice.facade.interface'
import PaymentFacadeInterface from '../../../payment/facade/facade.interface'
import { ProductAdmFacadeInterface } from '../../../product-adm/facade/product-adm.facade.interface'
import { StoreCatalogFacadeInterface } from '../../../store-catalog/facade/store-catalog.facade.interface'
import { Client } from '../../domain/client.entity'
import { Order } from '../../domain/order.entity'
import { Product } from '../../domain/product.entity'
import { CheckoutGateway } from '../../gateway/checkout.gateway'
import { PlaceOrderInputDTO, PlaceOrderOutputDTO } from './place-order.dto'

export class PlaceOrderUseCase implements UsecaseInterface {
  private _clientFacade: ClientAdmFacadeInterface
  private _productFacade: ProductAdmFacadeInterface
  private _storeCatalogFacade: StoreCatalogFacadeInterface
  private _paymentFacade: PaymentFacadeInterface
  private _invoiceFacade: InvoiceFacadeInterface
  private _checkoutRepository: CheckoutGateway

  constructor(
    clientFacade: ClientAdmFacadeInterface,
    productFacade: ProductAdmFacadeInterface,
    storeCatalogFacade: StoreCatalogFacadeInterface,
    paymentFacade: PaymentFacadeInterface,
    invoiceFacade: InvoiceFacadeInterface,
    checkoutRepository: CheckoutGateway
  ) {
    this._clientFacade = clientFacade
    this._productFacade = productFacade
    this._storeCatalogFacade = storeCatalogFacade
    this._paymentFacade = paymentFacade
    this._invoiceFacade = invoiceFacade
    this._checkoutRepository = checkoutRepository
  }

  async execute(input: PlaceOrderInputDTO): Promise<PlaceOrderOutputDTO> {
    const client = await this._clientFacade.find({ id: input.clientId })
    if (!client) {
      throw new Error('Client not found')
    }

    await this.validateProducts(input.products)

    const products = await Promise.all(
      input.products.map(async (product) => {
        const productData = await this.getProduct(product.productId)
        return productData
      })
    )

    const myClient = new Client({
      id: new Id(client.id),
      name: client.name,
      address: client.address,
      email: client.email
    })

    const order = new Order({
      client: myClient,
      products: products
    })

    const payment = await this._paymentFacade.process({
      orderId: order.id.id,
      amount: order.total
    })

    const invoice =
      payment.status === 'approved'
        ? await this._invoiceFacade.generate({
            name: client.name,
            document: '12346',
            street: client.address,
            number: client.address,
            complement: client.address,
            city: client.address,
            state: client.address,
            zipCode: client.address,
            items: products.map((product) => ({
              id: product.id.id,
              name: product.name,
              price: product.salesPrice
            }))
          })
        : null

    payment.status === 'approved' && order.approved()
    this._checkoutRepository.addOrder(order)

    return {
      id: order.id.id,
      invoiceId: payment.status === 'approved' ? (invoice?.id as string) : null,
      status: order.status,
      total: order.total,
      products: order.products.map((p) => ({
        productId: p.id.id
      }))
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
