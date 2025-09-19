import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, OneToOne } from 'typeorm';
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

  @OneToOne(() => CustomerAddress, (address) => address.pessoa, { cascade:true, onDelete: 'CASCADE' })
  enderecos: CustomerAddress;

  @OneToMany(() => Carrinho, (carrinho) => carrinho.pessoa,{ cascade:true,onDelete: 'CASCADE' })
  carrinhos: Carrinho[];

  @OneToMany(() => Vendas, (venda) => venda.pessoa,{ cascade:true,onDelete: 'CASCADE' })
  vendas: Vendas[];
}
