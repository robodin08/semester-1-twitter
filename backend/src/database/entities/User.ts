import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, OneToMany } from "typeorm";
import { Session } from "./Session";
import { Post } from "./Post";
import { PostAction } from "./PostAction";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  username: string;

  @Column({ type: "varchar", unique: true })
  email: string;

  @Column({ type: "varchar" })
  password: string;

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => PostAction, (postActions) => postActions.user)
  postActions: PostAction[];

  @CreateDateColumn({ type: "timestamp", precision: 0 })
  createdAt: Date;
}
