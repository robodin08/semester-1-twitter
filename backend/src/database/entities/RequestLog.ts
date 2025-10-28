import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "@entities/User";

@Entity()
export class RequestLog {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar" })
  method!: string;

  @Column({ type: "varchar" })
  path!: string;

  @Column({ type: "varchar" })
  ip!: string;

  @Column({ type: "int" })
  status!: number;

  @Column({ type: "varchar", nullable: true })
  errorType!: string | null;

  @Column({ type: "int", nullable: true })
  responseTime?: number;

  @ManyToOne(() => User, (user) => user.requests, {
    nullable: true,
    onDelete: "CASCADE",
  })
  user?: User | null;

  @CreateDateColumn({ type: "timestamp", precision: 0 })
  createdAt!: Date;
}
