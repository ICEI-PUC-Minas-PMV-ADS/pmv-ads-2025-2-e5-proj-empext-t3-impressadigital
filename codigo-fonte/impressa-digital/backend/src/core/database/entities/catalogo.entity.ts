import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CatalogoProdutos } from './catalogo_produtos.entity';

@Entity('catalogos')
export class Catalogos {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nome: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @OneToMany(() => CatalogoProdutos, (cp) => cp.catalogo)
  produtos: CatalogoProdutos[];
}
