import express from 'express'
import { AddProductUseCase } from '../../modules/product-adm/use-case/add-product/add-product.usecase'
import { ProductRepository as ProductRepositoryAdm } from '../../modules/product-adm/repository/product.repository'
import { UpsertProductUseCase } from '../../modules/store-catalog/use-case/upsert-product/upsert-product.usecase'
import { ProductRepository as ProductRepositoryCatalog } from '../../modules/store-catalog/repository/product.repository'

export const productRoute = express.Router()

productRoute.post('/product-adm', async (req, res) => {
  const addProcuctAdm = new AddProductUseCase(new ProductRepositoryAdm())

  try {
    const productAdmDTO = {
      id: req.body.id,
      name: req.body.name,
      description: req.body.description,
      purchasePrice: req.body.purchasePrice,
      stock: req.body.stock
    }

    const admOutput = await addProcuctAdm.execute(productAdmDTO)

    res.status(200).json(admOutput)
  } catch (error) {
    console.log('error', error)
    res.status(500).json({ error })
  }
})

productRoute.post('/product-catalog', async (req, res) => {
  const upseartCatalog = new UpsertProductUseCase(
    new ProductRepositoryCatalog()
  )

  try {
    const upsertCatalogDTO = {
      id: req.body.id,
      name: req.body.name,
      description: req.body.description,
      salesPrice: req.body.salesPrice
    }

    const upseartOutput = await upseartCatalog.execute(upsertCatalogDTO)

    res.status(200).json(upseartOutput)
  } catch (error) {
    console.log('error', error)
    res.status(500).json({ error })
  }
})
