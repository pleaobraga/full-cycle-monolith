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
      address: 'address',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const output = await facade.find({ id: '1' })

    expect(output).toEqual({
      id: '1',
      name: 'Client 1',
      email: 'email',
      address: 'address'
    })
  })

  it('should add a client', async () => {
    const clientAdmFacade = ClientAdmFacadeFactory.create()

    const input = {
      id: '1',
      name: 'Product 1',
      email: 'email',
      address: 'address'
    }

    await clientAdmFacade.add(input)

    const client = (await ClientModel.findOne({
      where: { id: input.id }
    })) as ClientModel

    expect(client).toBeDefined()
    expect(client.id).toBe(input.id)
    expect(client.name).toBe(input.name)
    expect(client.email).toBe(input.email)
    expect(client.address).toBe(input.address)
  })
})
