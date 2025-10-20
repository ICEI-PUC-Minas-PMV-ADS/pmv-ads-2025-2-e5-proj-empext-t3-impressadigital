import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Produtos } from './products.entity';


@Entity('categorias')
export class Categorias {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @OneToMany(() => Produtos, (produto) => produto.categoria)
  produtos: Produtos[];

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false }) 
  slug: string;
  
}
