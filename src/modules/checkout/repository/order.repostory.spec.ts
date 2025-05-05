import { Sequelize } from 'sequelize-typescript'
import { ClientModel } from '../../client-adm/repository/client.model'
import { OrderProductModel } from '../repository/order-product.model'
import { Order } from '../domain/order.entity'
import { Client } from '../domain/client.entity'
import { Id } from '../../@shared/domain/value-object/id.value-object'
import { Product } from '../domain/product.entity'
import { ProductModel } from '../../store-catalog/repository/product.model'
import { CheckoutRepository } from './order.repostory'
import { OrderModel } from './order.model'

describe('CheckoutRepository', () => {
  let sequelize: Sequelize

  beforeAll(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false
    })

    sequelize.addModels([
      ClientModel,
      ProductModel,
      OrderModel,
      OrderProductModel
    ])
    await sequelize.sync({ force: true })
  })

  afterAll(async () => {
    await sequelize.close()
  })

  it('should add and find an order', async () => {
    const client = await ClientModel.create({
      id: 'c1',
      name: 'Client A',
      email: 'client@example.com',
      street: 'Main',
      number: 1,
      complement: '',
      city: 'City',
      state: 'ST',
      zipCode: '12345',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const product = await ProductModel.create({
      id: 'p1',
      name: 'Product A',
      description: 'Test product',
      salesPrice: 100,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const clientEntity = new Client({
      id: new Id(client.id),
      name: client.name,
      email: client.email,
      street: client.street,
      number: client.number,
      complement: client.complement,
      city: client.city,
      state: client.state,
      zipCode: client.zipCode
    })

    const productEntity = new Product({
      id: new Id(product.id),
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice
    })

    const order = new Order({
      id: new Id('o1'),
      client: clientEntity,
      products: [productEntity]
    })

    const repository = new CheckoutRepository()

    // Act
    await repository.addOrder(order)
    const found = await repository.findOrder('o1')

    // // Assert
    expect(found).not.toBeNull()
    expect(found?.id.id).toBe('o1')
    expect(found?.client.name).toBe('Client A')
    expect(found?.products.length).toBe(1)
    expect(found?.products[0].name).toBe('Product A')
    expect(found?.total).toBe(100)
  })

  it('should return null if order not found', async () => {
    const repository = new CheckoutRepository()
    const found = await repository.findOrder('non-existing-id')
    expect(found).toBeNull()
  })
})
