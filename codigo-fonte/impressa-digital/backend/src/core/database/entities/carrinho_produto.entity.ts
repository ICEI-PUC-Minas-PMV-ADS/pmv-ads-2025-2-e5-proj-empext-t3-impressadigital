import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Carrinho } from './carrinho.entity';
import { Produtos } from './products.entity';
import { PrimaryGeneratedColumn } from 'typeorm';


@Entity('carrinho_produtos')
export class CarrinhoProdutos {

  @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    carrinho_id: number;

    @Column({ nullable: false })
    produto_id: number;

    @Column({ type: 'int', default: 1 })
    quantidade: number;

    @ManyToOne(() => Carrinho, (carrinho) => carrinho.produtos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'carrinho_id' })
    carrinho: Carrinho;

    @ManyToOne(() => Produtos, (produto) => produto.carrinho_produtos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'produto_id' })
    produto: Produtos;

}
