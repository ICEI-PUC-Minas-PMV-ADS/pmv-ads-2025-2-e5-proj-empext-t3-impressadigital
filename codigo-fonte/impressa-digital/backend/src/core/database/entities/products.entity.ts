import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Midias } from './midias.entity';
import { CarrinhoProdutos } from './carrinho_produto.entity';
import { CatalogoProdutos } from './catalogo_produtos.entity';
import { Categorias } from './category.entity';

@Entity('produtos')
export class Produtos {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({nullable: false})
  categoria_id: number;

  @ManyToOne(() => Categorias, (categoria) => categoria.produtos)
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categorias;

  @Column()
  nome: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  preco: number;

   @Column ()
   status_produto : boolean

  @OneToMany(() => Midias, (midia) => midia.produto)
  midias: Midias[];

  @OneToMany(() => CatalogoProdutos, (cp) => cp.produto)
  catalogos: CatalogoProdutos[];

  @OneToMany(() => CarrinhoProdutos, (cp) => cp.produto)
  carrinho_produtos: CarrinhoProdutos[];

 
  
}
