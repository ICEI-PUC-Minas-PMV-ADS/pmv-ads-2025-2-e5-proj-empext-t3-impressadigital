import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { JoinColumn } from 'typeorm';
import { Produtos } from './products.entity';


@Entity('vendas')
export class Vendas {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    user_id: number;

    @ManyToOne(() => User, (users) => users.vendas)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @CreateDateColumn()
    data_venda: Date;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    valor_total: number;

    @Column({ type: 'enum', enum: ['pendente', 'confirmado', 'cancelado'], default: 'pendente' })
    status: string;

    @Column({ type: 'text', nullable: true })
    observacoes: string;

}
