import express, { Express } from 'express'
import { Sequelize } from 'sequelize-typescript'
import { clientRoute } from './routes/client.route'
import { ClientModel } from '../modules/client-adm/repository/client.model'
import { productRoute } from './routes/products.route'
import { ProductModel } from '../modules/product-adm/repository/product.model'
import { Umzug } from 'umzug'
import { migrator } from '../test-migrations/config-migrations/migrator'

export const app: Express = express()
app.use(express.json())
app.use('/clients', clientRoute)
app.use('/products', productRoute)

export let sequelize: Sequelize
export let migration: Umzug<any>

export async function setupDb() {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false
  })

  await sequelize.addModels([ClientModel, ProductModel])

  migration = migrator(sequelize)
  await migration.up()
}

// setupDb()
