import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Catalogos } from './catalogo.entity';
import { Produtos } from './products.entity';



@Entity('catalogo_produtos')
export class CatalogoProdutos {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    catalogo_id: number;

    @Column({ nullable: false })
    produto_id: number;

    @Column({ type: 'int', default: 1 })
    quantidade: number;

    @ManyToOne(() => Catalogos, (catalogo) => catalogo.produtos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'catalogo_id' })
    catalogo: Catalogos;

    @ManyToOne(() => Produtos, (produto) => produto.catalogos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'produto_id' })
    produto: Produtos;


}
