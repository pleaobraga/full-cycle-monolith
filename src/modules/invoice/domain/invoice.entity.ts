import { AggregateRoot } from '../../@shared/domain/entity/aggregate-root.interface'
import { BaseEntity } from '../../@shared/domain/entity/base.entity'
import { Address } from '../../@shared/domain/value-object/adress.value-object'
import { Id } from '../../@shared/domain/value-object/id.value-object'

interface InvoiceItem {
  id: Id
  name: string
  price: number
}

interface InvoiceProps {
  id?: Id
  name: string
  document: string
  address: Address
  items: InvoiceItem[]
  createdAt?: Date
  updatedAt?: Date
}

export class Invoice extends BaseEntity implements AggregateRoot {
  private _name: string
  private _document: string
  private _address: Address
  private _items: InvoiceItem[]

  constructor(props: InvoiceProps) {
    super(props.id)
    this._name = props.name
    this._document = props.document
    this._address = new Address(
      props.address.street,
      props.address.number,
      props.address.complement,
      props.address.city,
      props.address.state,
      props.address.zipCode
    )
    this._items = props.items
  }

  get name(): string {
    return this._name
  }

  get document(): string {
    return this._document
  }

  get address(): Address {
    return this._address
  }

  get items(): InvoiceItem[] {
    return this._items
  }
}
