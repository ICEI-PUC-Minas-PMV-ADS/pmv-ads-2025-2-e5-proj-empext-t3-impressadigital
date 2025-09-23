import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, OneToOne } from 'typeorm';
import { Carrinho } from './carrinho.entity';
import { CustomerAddress } from './customer_address.entity';
import { Vendas } from './vendas.entity';
import { UserRole } from './enum/userRole.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: false })
  phone: string;

  @Column({ type: 'date', nullable: true })
  birthDate: Date;

  @Column({ unique: true, nullable: true })
  cpf: string;

  @Column({ nullable: true })
  password: string;

  @Column({ type: 'enum', enum: ['admin', 'cliente'], default: 'cliente' })
  role: UserRole;

  @CreateDateColumn()
  criado_em: Date;

  @OneToOne(() => CustomerAddress, (address) => address.user, { cascade: true, onDelete: 'CASCADE' })
  endereco: CustomerAddress;

  @OneToMany(() => Carrinho, (carrinho) => carrinho.user, { cascade: true, onDelete: 'CASCADE' })
  carrinhos: Carrinho[];

  @OneToMany(() => Vendas, (venda) => venda.user, { cascade: true, onDelete: 'CASCADE' })
  vendas: Vendas[];

  @Column()
  avaliacoes:string;



}
