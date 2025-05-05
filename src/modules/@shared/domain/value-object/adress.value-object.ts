import { ValueObject } from './value-object.interface'

export class Address implements ValueObject {
  private readonly _street: string
  private readonly _number: number
  private readonly _complement: string
  private readonly _city: string
  private readonly _state: string
  private readonly _zipCode: string

  constructor(
    street: string,
    number: number,
    complement: string,
    city: string,
    state: string,
    zipCode: string
  ) {
    this._street = street
    this._number = number
    this._complement = complement
    this._city = city
    this._state = state
    this._zipCode = zipCode
  }

  get street(): string {
    return this._street
  }

  get number(): number {
    return this._number
  }

  get complement(): string {
    return this._complement
  }

  get city(): string {
    return this._city
  }

  get state(): string {
    return this._state
  }

  get zipCode(): string {
    return this._zipCode
  }
}
