import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./post.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  userId: string;

  @Column({ unique: true, type: "text" })
  email: string;

  @Column({ type: "text" })
  name: string;

  @Column({ nullable: true, type: "text" })
  avatar: string;

  @Column({ length: 10, default: "author" })
  role: "admin" | "author";

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(
    () => Post,
    post => post.author,
  )
  posts: Post[];
}
