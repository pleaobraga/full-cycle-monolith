import request from 'supertest'

import { app, migration, sequelize, setupDb } from '../express'

describe('Product API E2E Test', () => {
  beforeEach(async () => {
    await setupDb()
  })

  afterEach(async () => {
    await migration.down()
    await sequelize.close()
  })

  it('should create a adm product', async () => {
    const response = await request(app).post('/products/product-adm').send({
      name: 'Notebook',
      description: 'High performance',
      purchasePrice: 1500,
      stock: 10
    })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id')
    expect(response.body.name).toBe('Notebook')
    expect(response.body.description).toBe('High performance')
    expect(response.body.purchasePrice).toBe(1500)
    expect(response.body.stock).toBe(10)
  })

  it('should create a store catalog product', async () => {
    const response = await request(app).post('/products/product-catalog').send({
      name: 'Notebook',
      description: 'High performance',
      salesPrice: 1500
    })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id')
    expect(response.body.name).toBe('Notebook')
    expect(response.body.description).toBe('High performance')
    expect(response.body.salesPrice).toBe(1500)
  })
})
