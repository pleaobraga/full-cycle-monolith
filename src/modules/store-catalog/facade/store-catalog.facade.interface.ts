export interface FindStoreCatalogFacadeInputDto {
  id: string
}

export interface FindStoreCatalogOutputDto {
  id: string
  name: string
  description: string
  salesPrice: number
}

export interface FindAllStoreCatalogFacadeOutputDto {
  products: {
    id: string
    name: string
    description: string
    salesPrice: number
  }[]
}

export interface StoreCatalogFacadeInterface {
  find: (
    input: FindStoreCatalogFacadeInputDto
  ) => Promise<FindStoreCatalogOutputDto>
  findAll: () => Promise<FindAllStoreCatalogFacadeOutputDto>
}
