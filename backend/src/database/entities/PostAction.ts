import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index,
} from "typeorm";
import { User } from "./User";
import { Post } from "./Post";

export enum PostActionType {
  BOOST = "BOOST",
  DISLIKE = "DISLIKE",
}

@Entity()
@Index(["user", "post"], { unique: true })
export class PostAction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "enum", enum: PostActionType })
  action: string;

  @ManyToOne(() => User, (u) => u.postActions, { onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => Post, (p) => p.postActions, { onDelete: "CASCADE" })
  post: Post;

  @CreateDateColumn({ type: "timestamp", precision: 0 })
  createdAt: Date;
}
