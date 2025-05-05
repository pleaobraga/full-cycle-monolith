export interface FindClientFacadeInputDto {
  id: string
}

export interface FindClienOutputDto {
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

export interface AddClientFacadeInputDto {
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

export interface ClientAdmFacadeInterface {
  find: (input: FindClientFacadeInputDto) => Promise<FindClienOutputDto>
  add: (input: AddClientFacadeInputDto) => Promise<void>
}
