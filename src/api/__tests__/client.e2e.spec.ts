import request from 'supertest'
import { app, migration, sequelize, setupDb } from '../express'

describe('Client API E2E Test', () => {
  beforeEach(async () => {
    await setupDb()
  })

  afterEach(async () => {
    await migration.down()
    await sequelize.close()
  })

  it('should create a client', async () => {
    const response = await request(app).post('/clients').send({
      name: 'Alice Smith',
      email: 'alice@example.com',
      street: 'Main St',
      number: 42,
      complement: 'Apt 5',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105'
    })

    expect(response.status).toBe(200)
    expect(response.body.id).toBeDefined()
    expect(response.body.name).toBe('Alice Smith')
    expect(response.body.email).toBe('alice@example.com')
  })

  it('should return 500 if address is missing', async () => {
    const response = await request(app).post('/clients').send({
      name: 'John Doe',
      email: 'john@example.com'
    })

    expect(response.status).toBe(500)
    expect(response.body).toHaveProperty('error')
  })
})
