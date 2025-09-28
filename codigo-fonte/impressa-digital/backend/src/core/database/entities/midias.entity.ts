import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Produtos } from './products.entity';
import { Avaliacoes_Produto } from './avaliacoes_produtos.entity';

@Entity('midias')
export class Midias {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Produtos, (produto) => produto.midias, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'produto_id' })
    produto: Produtos;

    @ManyToOne(() => Avaliacoes_Produto, (avaliacao) => avaliacao.midias, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'avaliacao_id' })
    avaliacao: Avaliacoes_Produto;

    @Column()
    url: string;

    @Column({ type: 'enum', enum: ['imagem', 'video'], default: 'imagem' })
    tipo: string;
}