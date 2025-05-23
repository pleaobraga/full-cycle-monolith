export interface PlaceOrderInputDTO {
  clientId: string
  products: {
    productId: string
  }[]
}

export interface PlaceOrderOutputDTO {
  id: string
  invoiceId: string | null
  status: string
  total: number
  products: {
    productId: string
  }[]
}
