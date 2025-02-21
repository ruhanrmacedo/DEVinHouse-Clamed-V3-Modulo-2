import { Entity, Column, OneToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity("drivers")
export class Driver {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 30, nullable: false })
  document: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  full_address?: string;

  @OneToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;
}
