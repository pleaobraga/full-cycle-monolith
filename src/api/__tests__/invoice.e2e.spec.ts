import request from 'supertest'

import { app, migration, sequelize, setupDb } from '../express'

const client = {
  id: '123',
  name: 'Alice Smith',
  email: 'alice@example.com',
  street: 'Main St',
  number: 42,
  complement: 'Apt 5',
  city: 'San Francisco',
  state: 'CA',
  zipCode: '94105'
}

const product = {
  id: '1',
  name: 'Notebook',
  description: 'High performance',
  purchasePrice: 1500,
  stock: 10,
  salesPrice: 2500
}

describe('Invoice API E2E Test', () => {
  beforeEach(async () => {
    await setupDb()
  })

  afterEach(async () => {
    await migration.down()
    await sequelize.close()
  })

  it('should create a checkout', async () => {
    //create a client
    await request(app).post('/clients').send(client)

    // //create adm-product
    await request(app).post('/products/product-adm').send(product)

    // //create store-catalog-product
    await request(app).post('/products/product-catalog').send(product)

    const checkoutDTO = {
      clientId: client.id,
      products: [
        {
          productId: product.id
        }
      ]
    }

    //checkout api
    const checkoutResponse = await request(app)
      .post('/checkout')
      .send(checkoutDTO)

    //invoice API
    const response = await request(app).get(
      `/invoice/${checkoutResponse.body.invoiceId}`
    )

    expect(response.status).toBe(200)
    expect(response.body.id).toBeDefined()
    expect(response.body.name).toBe('Alice Smith')
    expect(response.body.document).toBe('12346')
    expect(response.body.address).toEqual({
      street: 'Main St',
      number: 42,
      complement: 'Apt 5',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105'
    })
    expect(response.body.items).toEqual([
      { id: '1', name: 'Notebook', price: 2500 }
    ])
    expect(response.body.createdAt).toBeDefined()
    expect(response.body.total).toBe(2500)
  })
})
