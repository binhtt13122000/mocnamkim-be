import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("account")
export class Account {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ unique: true, type: "text" })
  username: string;

  @Column({ type: "text" })
  password: string;

  @Column({ type: "text" })
  role: string;

  @Column({ type: "text" })
  name: string;

  @Column({ default: true })
  isActive: boolean;
}
