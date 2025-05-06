export interface UpsertProductInputDTO {
  id?: string
  name: string
  description: string
  salesPrice: number
}

export interface UpsertProductOutputDTO {
  id: string
  name: string
  description: string
  salesPrice: number
}
