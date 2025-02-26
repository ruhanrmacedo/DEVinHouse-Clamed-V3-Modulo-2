import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from "typeorm";
import { Branch } from "./Branch";
import { Product } from "./Product";
import { MovementStatusEnum } from "./enums/MovementStatusEnum";
import { Driver } from "./Driver";

@Entity("movements")
export class Movement {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Branch, { nullable: false, onDelete: "CASCADE" })
    @JoinColumn({ name: "destination_branch_id" })
    destinationBranch: Branch;

    @ManyToOne(() => Product, { nullable: false, onDelete: "CASCADE" })
    @JoinColumn({ name: "product_id" })
    product: Product;

    @ManyToOne(() => Driver, { nullable: true, onDelete: "SET NULL" })
    @JoinColumn({ name: "driver_id" })
    driver?: Driver;

    @Column({ type: "int", nullable: false })
    quantity: number;

    @Column({ type: "enum", enum: MovementStatusEnum, default: MovementStatusEnum.PENDING })
    status: MovementStatusEnum;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updated_at: Date;
}
