import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, JoinColumn } from 'typeorm';
import { Pessoas } from './pessoas.entity';
import { CarrinhoProdutos } from './carrinho_produto.entity';

@Entity('carrinho')
export class Carrinho {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ nullable: false })
  produto_id: number;

  @CreateDateColumn()
  criado_em: Date;
  
  @ManyToOne(() => Pessoas, (pessoa) => pessoa.carrinhos)
  @JoinColumn({ name: 'pessoa_id' })
  pessoa: Pessoas;


  @OneToMany(() => CarrinhoProdutos, (cp) => cp.carrinho)
  produtos: CarrinhoProdutos[];
}
