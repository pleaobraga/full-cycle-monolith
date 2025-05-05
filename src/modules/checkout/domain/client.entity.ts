import { AggregateRoot } from '../../@shared/domain/entity/aggregate-root.interface'
import { BaseEntity } from '../../@shared/domain/entity/base.entity'
import { Address } from '../../@shared/domain/value-object/adress.value-object'
import { Id } from '../../@shared/domain/value-object/id.value-object'

type ClientProps = {
  id?: Id
  name: string
  email: string
  street: string
  number: number
  complement: string
  city: string
  state: string
  zipCode: string
}

export class Client extends BaseEntity implements AggregateRoot {
  private _name: string
  private _email: string
  private _address: Address

  constructor(props: ClientProps) {
    super(props.id)
    this._name = props.name
    this._email = props.email
    this._address = new Address(
        props.street,
        props.number,
        props.complement,
        props.city,
        props.state,
        props.zipCode
      )
  }

  get name(): string {
    return this._name
  }

  get email(): string {
    return this._email
  }

  get address(): Address {
    return this._address
  }
}
