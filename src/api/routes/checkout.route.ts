import express from 'express'
import { PlaceOrderUseCase } from '../../modules/checkout/use-case/place-order/place-order.use-case'
import { ClientAdmFacadeFactory } from '../../modules/client-adm/factory/facade.factory'
import { ProductAdmFacadeFactory } from '../../modules/product-adm/factory/facade.factory'
import { StoreCatalogFacadeFactory } from '../../modules/store-catalog/factory/facade.factory'
import PaymentFacadeFactory from '../../modules/payment/factory/payment.facade.factory'
import { InvoiceFacadeFactory } from '../../modules/invoice/factory/facade.factory'
import { CheckoutRepository } from '../../modules/checkout/repository/order.repostory'

export const checkoutRoute = express.Router()

checkoutRoute.post('/', async (req, res) => {
  const clientFacade = ClientAdmFacadeFactory.create()
  const productAdmFacade = ProductAdmFacadeFactory.create()
  const storeCatalogFacade = StoreCatalogFacadeFactory.create()
  const paymentFacade = PaymentFacadeFactory.create()
  const invoiceFacade = InvoiceFacadeFactory.create()

  const checkoutRepository = new CheckoutRepository()

  const usecase = new PlaceOrderUseCase(
    clientFacade,
    productAdmFacade,
    storeCatalogFacade,
    paymentFacade,
    invoiceFacade,
    checkoutRepository
  )

  try {
    const customerDTO = {
      clientId: req.body.clientId,
      products: req.body.products
    }

    const output = await usecase.execute(customerDTO)
    res.status(200).json(output)
  } catch (error) {
    console.log('error', error)
    res.status(500).json({ error })
  }
})
