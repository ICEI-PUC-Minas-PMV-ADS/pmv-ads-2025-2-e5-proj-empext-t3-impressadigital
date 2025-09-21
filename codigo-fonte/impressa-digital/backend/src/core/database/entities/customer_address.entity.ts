import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Pessoas } from './pessoas.entity';
import { OneToOne } from 'typeorm';


@Entity('customer_address')
export class CustomerAddress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  pessoa_id: number;

  @OneToOne(() => Pessoas, (pessoa) => pessoa.enderecos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pessoa_id' })
  pessoa: Pessoas;

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
