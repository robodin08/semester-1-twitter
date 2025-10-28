import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, OneToMany } from "typeorm";
import { Session } from "@entities/Session";
import { Post } from "@entities/Post";
import { PostAction } from "@entities/PostAction";
import { RequestLog } from "@datasource";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar" })
  username!: string;

  @Column({ type: "varchar", unique: true })
  email!: string;

  @Column({ type: "varchar" })
  password!: string;

  @OneToMany(() => Session, (session) => session.user)
  sessions?: Session[];

  @OneToMany(() => Post, (post) => post.user)
  posts?: Post[];

  @OneToMany(() => PostAction, (postAction) => postAction.user)
  postActions?: PostAction[];

  @OneToMany(() => RequestLog, (requestLog) => requestLog.user)
  requests?: PostAction[];

  @CreateDateColumn({ type: "timestamp", precision: 0 })
  createdAt!: Date;
}
