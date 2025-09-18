import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Carrinho } from './carrinho.entity';
import { CustomerAddress } from './customer_address.entity';
import { Vendas } from './vendas.entity';

@Entity('pessoas')
export class Pessoas {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  senha: string;

  @Column({ type: 'enum', enum: ['admin', 'cliente'], default: 'cliente' })
  tipo: string;

  @CreateDateColumn()
  criado_em: Date;

  @OneToMany(() => CustomerAddress, (address) => address.pessoa)
  enderecos: CustomerAddress[];

  @OneToMany(() => Carrinho, (carrinho) => carrinho.pessoa)
  carrinhos: Carrinho[];

  @OneToMany(() => Vendas, (venda) => venda.pessoa)
  vendas: Vendas[];
}
