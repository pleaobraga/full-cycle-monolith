import express from 'express'
import { AddProductUseCase } from '../../modules/product-adm/use-case/add-product/add-product.usecase'
import { ProductRepository } from '../../modules/product-adm/repository/product.repository'

export const productRoute = express.Router()

productRoute.post('/', async (req, res) => {
  const usecase = new AddProductUseCase(new ProductRepository())

  try {
    const productDTO = {
      id: req.body.id,
      name: req.body.name,
      description: req.body.description,
      purchasePrice: req.body.purchasePrice,
      stock: req.body.stock
    }

    const output = await usecase.execute(productDTO)

    res.status(200).json(output)
  } catch (error) {
    console.log('error', error)
    res.status(500).json({ error })
  }
})
