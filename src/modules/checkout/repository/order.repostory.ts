import { Order } from '../domain/order.entity'
import { OrderModel } from '../repository/order.model'
import { OrderProductModel } from '../repository/order-product.model'
import { Id } from '../../@shared/domain/value-object/id.value-object'
import { Client } from '../domain/client.entity'
import { Product } from '../domain/product.entity'
import { CheckoutGateway } from '../gateway/checkout.gateway'
import { ClientModel } from '../../client-adm/repository/client.model'
import { ProductModel } from '../../store-catalog/repository/product.model'

export class CheckoutRepository implements CheckoutGateway {
  async addOrder(order: Order): Promise<void> {
    await OrderModel.create({
      id: order.id.id,
      clientId: order.client.id.id,
      status: order.status
    })

    await Promise.all(
      order.products.map((product) =>
        OrderProductModel.create({
          orderId: order.id.id,
          productId: product.id.id
        })
      )
    )
  }

  async findOrder(id: string): Promise<Order | null> {
    const order = await OrderModel.findOne({
      where: { id },
      include: [
        { model: ProductModel, through: { attributes: [] } },
        { model: ClientModel }
      ]
    })

    if (!order) return null

    const client = new Client({
      id: new Id(order.client.id),
      name: order.client.name,
      email: order.client.email,
      street: order.client.street,
      number: order.client.number,
      complement: order.client.complement,
      city: order.client.city,
      state: order.client.state,
      zipCode: order.client.zipCode
    })

    const products = order.products.map(
      (p) =>
        new Product({
          id: new Id(p.id),
          name: p.name,
          description: p.description,
          salesPrice: p.salesPrice
        })
    )

    return new Order({
      id: new Id(order.id),
      client,
      products,
      status: order.status
    })
  }
}
