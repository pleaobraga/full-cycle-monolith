export interface AddClientInputDTO {
  id?: string
  name: string
  email: string
  address: string
}

export interface AddclientOutputDTO {
  id: string
  name: string
  email: string
  address: string
  createdAt: Date
  updatedAt: Date
}
