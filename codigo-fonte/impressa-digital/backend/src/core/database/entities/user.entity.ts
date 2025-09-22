import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, OneToOne } from 'typeorm';
import { Carrinho } from './carrinho.entity';
import { CustomerAddress } from './customer_address.entity';
import { Vendas } from './vendas.entity';

@Entity('users')
export class User {
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

  @OneToOne(() => CustomerAddress, (address) => address.user, { cascade:true, onDelete: 'CASCADE' })
  enderecos: CustomerAddress;

  @OneToMany(() => Carrinho, (carrinho) => carrinho.user,{ cascade:true,onDelete: 'CASCADE' })
  carrinhos: Carrinho[];

  @OneToMany(() => Vendas, (venda) => venda.user,{ cascade:true,onDelete: 'CASCADE' })
  vendas: Vendas[];
}
