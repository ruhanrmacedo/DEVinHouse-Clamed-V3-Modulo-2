import { Entity, Column, OneToOne, JoinColumn, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { User } from "./User";
import { Product } from "./Product";
import { Movement } from "./Movement";

@Entity("branches")
export class Branch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 30, nullable: false })
  document: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  full_address?: string;

  @OneToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @OneToMany(() => Product, (product) => product.branch)
  products: Product[];

  @OneToMany(() => Movement, (movement) => movement.destinationBranch)
  movements: Movement[];
}
