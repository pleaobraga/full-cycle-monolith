export interface AddClientInputDTO {
  id?: string
  name: string
  email: string
  street: string
  number: number
  complement: string
  city: string
  state: string
  zipCode: string
}

export interface AddClientOutputDTO {
  id: string
  name: string
  email: string
  street: string
  number: number
  complement: string
  city: string
  state: string
  zipCode: string
  createdAt: Date
  updatedAt: Date
}
