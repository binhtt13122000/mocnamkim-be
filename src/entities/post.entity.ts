import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";

@Entity("posts")
export class Post {
  @PrimaryGeneratedColumn("uuid")
  postId: string;

  @Column({ type: "text" })
  title: string;

  @Column({ type: "text" })
  content: string;

  @Column({
    type: "timestamp without time zone",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column({
    type: "timestamp without time zone",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;

  @Column({ type: "timestamp without time zone", nullable: true })
  deletedAt: Date;

  @ManyToOne(
    () => User,
    user => user.posts,
    {},
  )
  @JoinColumn({ name: "authorId", referencedColumnName: "userId" })
  author: User;
}
