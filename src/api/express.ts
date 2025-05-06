import express, { Express } from 'express'
import { Sequelize } from 'sequelize-typescript'
import { clientRoute } from './routes/client.route'
import { ClientModel } from '../modules/client-adm/repository/client.model'
import { productRoute } from './routes/products.route'
import { ProductModel } from '../modules/product-adm/repository/product.model'
import { ProductModel as ProductCatalogModel } from '../modules/store-catalog/repository/product.model'
import { Umzug } from 'umzug'
import { migrator } from '../test-migrations/config-migrations/migrator'
import { OrderModel } from '../modules/checkout/repository/order.model'
import { OrderProductModel } from '../modules/checkout/repository/order-product.model'
import { checkoutRoute } from './routes/checkout.route'
import { TransactionModel } from '../modules/payment/repository/transaction.model'
import { InvoiceModel } from '../modules/invoice/repository/invoice.model'
import { InvoiceItemModel } from '../modules/invoice/repository/invoice-item.model'
import { invoiceRoute } from './routes/invoice.route'

export const app: Express = express()
app.use(express.json())
app.use('/clients', clientRoute)
app.use('/products', productRoute)
app.use('/checkout', checkoutRoute)
app.use('/invoice', invoiceRoute)

export let sequelize: Sequelize
export let migration: Umzug<any>

export async function setupDb() {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false
  })

  sequelize.addModels([
    ClientModel,
    ProductModel,
    ProductCatalogModel,
    OrderModel,
    OrderProductModel,
    TransactionModel,
    InvoiceModel,
    InvoiceItemModel
  ])

  migration = migrator(sequelize)
  await migration.up()
}

// setupDb()
