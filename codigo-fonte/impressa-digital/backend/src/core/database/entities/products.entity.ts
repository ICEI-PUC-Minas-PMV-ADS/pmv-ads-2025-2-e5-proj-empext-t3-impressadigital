import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Midias } from './midias.entity';
import { CarrinhoProdutos } from './carrinho_produto.entity';
import { CatalogoProdutos } from './catalogo_produtos.entity';
import { Categorias } from './category.entity';
import { ComentarioProduto } from './comentario_produtos.entity';
import { Avaliacoes_Produto } from './avaliacoes_produtos.entity';

@Entity('produtos')
export class Produtos {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  categoria_id: number;

  @Column()
  status: string;

  @ManyToOne(() => Categorias, (categoria) => categoria.produtos)
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categorias;

  @Column()
  nome: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  preco: number;

  @OneToMany(() => Midias, (midia) => midia.produto)
  midias: Midias[];

  @OneToMany(() => CatalogoProdutos, (cp) => cp.produto)
  catalogos: CatalogoProdutos[];

  @OneToMany(() => CarrinhoProdutos, (cp) => cp.produto)
  carrinho_produtos: CarrinhoProdutos[];

  @OneToMany(() => ComentarioProduto, (comentario) => comentario.produto)
  comentarios: ComentarioProduto[];

  @OneToMany(() => Avaliacoes_Produto, (avaliacoes) => avaliacoes.produto)
  avaliacoes: Avaliacoes_Produto[];
}
