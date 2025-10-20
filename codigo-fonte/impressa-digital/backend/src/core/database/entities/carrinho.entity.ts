import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, JoinColumn } from 'typeorm';

import { CarrinhoProdutos } from './carrinho_produto.entity';
import { User } from './user.entity';

@Entity('carrinho')
export class Carrinho {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  produto_id: number;


  @Column({ nullable: false })
  user_id: number;

  @CreateDateColumn()
  criado_em: Date;

  @ManyToOne(() => User, (user) => user.carrinhos)
  @JoinColumn({ name: 'user_id' })
  user: User;


  @OneToMany(() => CarrinhoProdutos, (cp) => cp.carrinho)
  produtos: CarrinhoProdutos[];
}
