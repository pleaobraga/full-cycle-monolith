import express from 'express'
import { FindInvoiceUseCase } from '../../modules/invoice/use-case/find-invoice/find-invoice.use-case'
import { InvoiceRepository } from '../../modules/invoice/repository/invoice.repository'

export const invoiceRoute = express.Router()

invoiceRoute.get('/:id', async (req, res) => {
  const usecase = new FindInvoiceUseCase(new InvoiceRepository())

  try {
    const invoiceDTO = {
      id: req.params.id
    }

    const output = await usecase.execute(invoiceDTO)
    res.status(200).json(output)
  } catch (error) {
    console.log('error', error)
    res.status(500).json({ error })
  }
})
