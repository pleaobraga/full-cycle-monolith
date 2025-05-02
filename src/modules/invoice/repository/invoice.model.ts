import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
  HasMany
} from 'sequelize-typescript'
import { InvoiceItemModel } from './invoice-item.model'

@Table({
  tableName: 'invoices',
  timestamps: false
})
export class InvoiceModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.STRING, allowNull: false })
  declare id: string

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string

  @Column({ type: DataType.STRING, allowNull: false })
  declare document: string

  @Column({ type: DataType.STRING, allowNull: false })
  declare street: string

  @Column({ type: DataType.STRING, allowNull: false })
  declare number: string

  @Column({ type: DataType.STRING })
  declare complement: string

  @Column({ type: DataType.STRING, allowNull: false })
  declare city: string

  @Column({ type: DataType.STRING, allowNull: false })
  declare state: string

  @Column({ type: DataType.STRING, allowNull: false })
  declare zipCode: string

  @HasMany(() => InvoiceItemModel)
  declare items: InvoiceItemModel[]

  @Column({ type: DataType.DATE, allowNull: false, field: 'created_at' })
  declare createdAt: Date

  @Column({ type: DataType.DATE, allowNull: false, field: 'updated_at' })
  declare updatedAt: Date
}
