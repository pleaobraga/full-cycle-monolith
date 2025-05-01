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
      address: 'address'
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
    expect(clientDb?.address).toBe(client.address)
  })

  it('should find a client', async () => {
    await ClientModel.create({
      id: '1',
      name: 'Client 1',
      email: 'email',
      address: 'address',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const clientRepository = new ClientRepository()

    const foundClient = await clientRepository.find('1')

    expect(foundClient).toBeDefined()
    expect(foundClient.id.id).toBe('1')
    expect(foundClient.name).toBe('Client 1')
    expect(foundClient.email).toBe('email')
    expect(foundClient.address).toBe('address')
  })
})
