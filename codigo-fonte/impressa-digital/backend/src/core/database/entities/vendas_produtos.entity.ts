import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Vendas } from './vendas.entity';
import { Produtos } from './products.entity';

@Entity('vendas_produtos')
export class VendasProdutos {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  venda_id: number;

  @Column()
  produto_id: number;

  @Column({ type: 'int', default: 1 })
  quantidade: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  preco_unitario: number;

  @ManyToOne(() => Vendas, (venda) => venda.vendas_produtos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'venda_id' })
  venda: Vendas;

  @ManyToOne(() => Produtos, (produto) => produto.vendas_produtos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'produto_id' })
  produto: Produtos;
}
