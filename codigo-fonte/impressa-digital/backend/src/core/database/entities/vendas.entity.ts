import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Pessoas } from './pessoas.entity';
import { JoinColumn } from 'typeorm';


@Entity('vendas')
export class Vendas {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    pessoa_id: number;

    @ManyToOne(() => Pessoas, (pessoa) => pessoa.vendas)
    @JoinColumn({ name: 'pessoa_id' })
    pessoa: Pessoas;

    @CreateDateColumn()
    data_venda: Date;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    valor_total: number;

    @Column({ type: 'enum', enum: ['pendente', 'confirmado', 'cancelado'], default: 'pendente' })
    status: string;

    @Column({ type: 'text', nullable: true })
    observacoes: string;
}
