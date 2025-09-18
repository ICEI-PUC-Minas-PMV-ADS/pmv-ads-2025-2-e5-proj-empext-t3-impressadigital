import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Produtos } from './products.entity';
import { JoinColumn } from 'typeorm';


@Entity('midias')
export class Midias {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    produto_id: number;

    @ManyToOne(() => Produtos, (produto) => produto.midias, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'produto_id' })
    produto: Produtos;

    @Column()
    url: string;

    @Column({ type: 'enum', enum: ['imagem', 'video'], default: 'imagem' })
    tipo: string;
}
