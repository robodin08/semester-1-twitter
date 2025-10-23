import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "@entities/User";

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar" })
  refreshToken!: string;

  @UpdateDateColumn({ type: "timestamp", precision: 0 })
  lastRefreshed!: Date;

  @Column({ type: "boolean", default: false })
  revoked!: boolean;

  @UpdateDateColumn({ type: "timestamp", precision: 0, nullable: true })
  revokedAt!: Date;

  @ManyToOne(() => User, (user) => user.sessions, { onDelete: "CASCADE" })
  user?: User;

  @CreateDateColumn({ type: "timestamp", precision: 0 })
  createdAt!: Date;
}
