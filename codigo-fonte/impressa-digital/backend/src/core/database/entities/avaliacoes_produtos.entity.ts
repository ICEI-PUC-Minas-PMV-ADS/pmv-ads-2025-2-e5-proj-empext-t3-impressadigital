import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Produtos } from './products.entity';
import { Midias } from './midias.entity';

@Entity('avaliacoes_produtos')
export class Avaliacoes_Produto {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    avaliacoes: string;

    @Column({
        type: 'enum',
        enum: [1, 2, 3, 4, 5],
        default: 5
    })
    rating: number;

    @ManyToOne(() => Produtos, (produto) => produto.comentarios, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'produto_id' })
    produto: Produtos;

    @ManyToOne(() => User, (user) => user.comentarios, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => Midias, (midia) => midia.avaliacao, { cascade: true })
    midias: Midias[];
}
