import request from 'supertest'
import { app, sequelize } from '../express'

describe('Client API E2E Test', () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true })
  })

  afterAll(async () => {
    await sequelize.close()
  })

  it('should create a client', async () => {
    const response = await request(app).post('/clients').send({
      name: 'John Doe',
      email: 'john@example.com',
      address: '123 Main St'
    })

    expect(response.status).toBe(200)
    expect(response.body.id).toBeDefined()
    expect(response.body.name).toBe('John Doe')
    expect(response.body.email).toBe('john@example.com')
    expect(response.body.address).toBe('123 Main St')
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
