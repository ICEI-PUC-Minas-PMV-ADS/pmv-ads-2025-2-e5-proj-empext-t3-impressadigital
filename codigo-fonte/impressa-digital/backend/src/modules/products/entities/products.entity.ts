
import { CarrinhoProdutos } from 'src/core/database/entities/carrinho_produto.entity';
import { CatalogoProdutos } from 'src/core/database/entities/catalogo_produtos.entity';
import { Categorias } from 'src/core/database/entities/category.entity';
import { Midias } from 'src/core/database/entities/midias.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';



@Entity('produtos')
export class Produtos {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Categorias, (categoria) => categoria.produtos)
  categoria: Categorias;

  @Column()
  nome: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  preco: number;

  @Column({ type: 'int', default: 0 })
  estoque: number;

  @OneToMany(() => Midias, (midia) => midia.produto)
  midias: Midias[];

  @OneToMany(() => CatalogoProdutos, (cp) => cp.produto)
  catalogos: CatalogoProdutos[];

  @OneToMany(() => CarrinhoProdutos, (cp) => cp.produto)
  carrinho_produtos: CarrinhoProdutos[];
}
