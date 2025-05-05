import { Sequelize } from 'sequelize-typescript'
import { ClientModel } from '../repository/client.model'
import { ClientAdmFacadeFactory } from '../factory/facade.factory'

let sequelize: Sequelize
describe('Client Adm Facade', () => {
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

  it('should find a client', async () => {
    const facade = ClientAdmFacadeFactory.create()
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

    const output = await facade.find({ id: '1' })

    expect(output).toEqual({
      id: '1',
      name: 'Client 1',
      email: 'email',
      street: 'Main St',
      number: 42,
      complement: 'Apt 5',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105'
    })
  })

  it('should add a client', async () => {
    const clientAdmFacade = ClientAdmFacadeFactory.create()

    const input = {
      id: '1',
      name: 'Client 1',
      email: 'email',
      street: 'Main St',
      number: 42,
      complement: 'Apt 5',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105'
    }

    await clientAdmFacade.add(input)

    const client = (await ClientModel.findOne({
      where: { id: input.id }
    })) as ClientModel

    expect(client).toBeDefined()
    expect(client.id).toBe(input.id)
    expect(client.name).toBe(input.name)
    expect(client.email).toBe(input.email)
    expect(client.street).toBe(input.street)
    expect(client.number).toBe(input.number)
    expect(client.complement).toBe(input.complement)
    expect(client.city).toBe(input.city)
    expect(client.state).toBe(input.state)
    expect(client.zipCode).toBe(input.zipCode)
  })
})
