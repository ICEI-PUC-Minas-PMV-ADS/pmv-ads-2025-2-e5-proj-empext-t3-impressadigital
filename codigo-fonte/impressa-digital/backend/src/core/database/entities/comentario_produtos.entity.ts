import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

import { User } from './user.entity';       // ajuste o caminho conforme sua estrutura
import { Produtos } from './products.entity';

@Entity('comentario_produtos')
export class ComentarioProduto {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    comentario: string;

    @ManyToOne(() => Produtos, (produto) => produto.comentarios, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'produto_id' })
    produto: Produtos;

    @ManyToOne(() => User, (user) => user.comentarios, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
}
