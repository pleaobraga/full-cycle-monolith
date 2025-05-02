import {
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'
import { InvoiceModel } from './invoice.model'

@Table({
  tableName: 'invoice_items',
  timestamps: false
})
export class InvoiceItemModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.STRING })
  declare id: string

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string

  @Column({ type: DataType.FLOAT, allowNull: false })
  declare price: number

  @ForeignKey(() => InvoiceModel)
  @Column({ type: DataType.STRING, allowNull: false })
  declare invoiceId: string
}
