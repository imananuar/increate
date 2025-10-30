import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  company_name: string;

  @Column()
  company_street_addr: string;

  @Column()
  company_building_addr: string;

  @Column()
  company_postcode: number;

  @Column()
  company_city: string;

  @Column()
  company_state: string;

  @Column()
  company_country: string;
}
