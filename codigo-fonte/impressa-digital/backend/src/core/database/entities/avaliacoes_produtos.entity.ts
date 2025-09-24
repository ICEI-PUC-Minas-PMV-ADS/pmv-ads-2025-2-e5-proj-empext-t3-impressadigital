import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';     
import { Produtos } from './products.entity';

@Entity('Avaliacoes_produtos')
export class Avaliacoes_Produto {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    avaliacoes: number;

    @ManyToOne(() => Produtos, (produto) => produto.comentarios, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'produto_id' })
    produto: Produtos;

    @ManyToOne(() => User, (user) => user.comentarios, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
}
