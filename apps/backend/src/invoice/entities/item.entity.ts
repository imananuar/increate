import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Invoice } from "./invoice.entity";

@Entity('item')
export class Item {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    invoice_id: string;

    @Column()
    name: string;

    @Column()
    quantity: number;

    @Column('decimal', { precision: 10, scale: 2 })
    price_per_unit: string;

    @Column('decimal', { precision: 10, scale: 2 })
    total_price: string;

    @Column()
    currency: string;

    @ManyToOne(() => Invoice, (invoice) => invoice.items)
    @JoinColumn({ name: 'invoice_id' })
    invoice: Invoice;
}