import { AddProductFacadeInputDto, CheckStockFacadeInputDto } from "../facade/product-adm.facade.interface"
import { ProductRepository } from "../repository/product.repository"
import { AddProductUseCase } from "../use-case/add-product.usecase"

export class ProductAdmFacadeFactory {
  static create() {
    const productRepository = new ProductRepository()
    const addProductUseCase = new AddProductUseCase(productRepository)
    // const checkStockUseCase = new CheckStockUseCase(productRepository)

    return {
      addProduct: async (input: AddProductFacadeInputDto) => {
        return await addProductUseCase.execute(input)
      },
    //   checkStock: async (input: CheckStockFacadeInputDto) => {
    //     return await checkStockUseCase.execute(input)
    //   },
    }
  }
}