import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToMany } from "typeorm";
import { PostAction } from "@entities/PostAction";
import { User } from "@entities/User";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar" })
  message!: string;

  @Column({ type: "int", default: 0 })
  boostCount!: number;

  @Column({ type: "int", default: 0 })
  dislikeCount!: number;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: "CASCADE" })
  user?: User;

  @OneToMany(() => PostAction, (postActions) => postActions.post, {
    onDelete: "CASCADE",
  })
  postActions?: PostAction[];

  @CreateDateColumn({ type: "timestamp", precision: 0 })
  createdAt!: Date;
}
