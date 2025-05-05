// order.model.ts
import {
  Table,
  Model,
  Column,
  PrimaryKey,
  BelongsTo,
  BelongsToMany,
  ForeignKey
} from 'sequelize-typescript'
import { ClientModel } from '../../client-adm/repository/client.model'
import { OrderProductModel } from './order-product.model'
import { ProductModel } from '../../store-catalog/repository/product.model'

@Table({ tableName: 'orders', timestamps: false })
export class OrderModel extends Model {
  @PrimaryKey
  @Column
  id!: string

  @ForeignKey(() => ClientModel)
  @Column
  clientId!: string

  @BelongsTo(() => ClientModel)
  client!: ClientModel

  @Column
  status!: string

  @BelongsToMany(() => ProductModel, () => OrderProductModel)
  products!: ProductModel[]
}
