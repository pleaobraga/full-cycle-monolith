import { Sequelize } from 'sequelize-typescript'
import { ClientModel } from './client.model'
import { ClientRepository } from './client.repository'
import { Id } from '../../@shared/domain/value-object/id.value-object'
import { Client } from '../domain/client.entity'

let sequelize: Sequelize
describe('Client Repository', () => {
  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    })

    await sequelize.addModels([ClientModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it('should create a client', async () => {
    const clientProps = {
      id: new Id(),
      name: 'Client 1',
      email: 'email',
      street: 'Main St',
      number: 42,
      complement: 'Apt 5',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105'
    }

    const client = new Client(clientProps)

    const clientRepository = new ClientRepository()
    await clientRepository.add(client)

    const clientDb = await ClientModel.findOne({
      where: { id: client.id.id }
    })

    expect(clientDb).toBeDefined()
    expect(clientDb?.id).toBe(client.id.id)
    expect(clientDb?.name).toBe(client.name)
    expect(clientDb?.email).toBe(client.email)
    expect(clientDb?.street).toBe(client.address.street)
    expect(clientDb?.number).toBe(client.address.number)
    expect(clientDb?.complement).toBe(client.address.complement)
    expect(clientDb?.city).toBe(client.address.city)
    expect(clientDb?.state).toBe(client.address.state)
    expect(clientDb?.zipCode).toBe(client.address.zipCode)
  })

  it('should find a client', async () => {
    await ClientModel.create({
      id: '1',
      name: 'Client 1',
      email: 'email',
      street: 'Main St',
      number: 42,
      complement: 'Apt 5',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const clientRepository = new ClientRepository()

    const foundClient = await clientRepository.find('1')

    expect(foundClient).toBeDefined()
    expect(foundClient.id.id).toBe('1')
    expect(foundClient.name).toBe('Client 1')
    expect(foundClient.email).toBe('email')
  })
})
