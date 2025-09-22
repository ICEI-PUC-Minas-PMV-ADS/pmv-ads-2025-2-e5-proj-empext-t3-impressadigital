import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { OneToOne } from 'typeorm';


@Entity('customer_address')
export class CustomerAddress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  pessoa_id: number;

  @OneToOne(() => User, (users) => users.enderecos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true })
  logradouro: string;

  @Column({ nullable: true })
  numero: string;

  @Column({ nullable: true })
  bairro: string;

  @Column({ nullable: true })
  cidade: string;

  @Column({ nullable: true })
  estado: string;

  @Column({ nullable: true })
  cep: string;
}
