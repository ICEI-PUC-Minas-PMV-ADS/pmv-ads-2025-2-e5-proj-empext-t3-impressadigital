import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('customer_address')
export class CustomerAddress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  user_id: number;

  @ManyToOne(() => User, (user) => user.enderecos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true, length: 255 })
  logradouro: string;

  @Column({ nullable: true, length: 20 })
  numero: string;

  @Column({ nullable: true, length: 255 })
  complemento?: string;

  @Column({ nullable: true, length: 100 })
  bairro: string;

  @Column({ nullable: true })
  cidade: string;

  @Column({ nullable: true, length: 100 })
  estado: string;

  @Column({ nullable: true, length: 9 })
  cep: string;

  @Column({ type: 'boolean', default: false })
  is_primary: boolean;
}
