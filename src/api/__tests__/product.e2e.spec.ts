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

  it('should create a product', async () => {
    const response = await request(app).post('/products').send({
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
})
