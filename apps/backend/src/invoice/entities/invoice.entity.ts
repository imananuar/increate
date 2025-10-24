import { UUID } from "crypto";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Item } from "./item.entity";

@Entity('invoice')
export class Invoice {
    @PrimaryColumn()
    invoice_id: string;

    @Column()
    invoice_no: string;

    @Column()
    created_by: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Column()
    customer_name: string;

    @Column()
    customer_address: string;

    @Column('decimal', { precision: 10, scale: 2 })
    total_price: string;

    @Column()
    token: number;

    @Column()
    model: string;

    @OneToMany(() => Item, (item) => item.invoice)
    items: Item[]
}
