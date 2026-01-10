import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class UserType{

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    role: string;

    @Column({default: null})
    description: string;

    @OneToMany(()=> User, user => user.userType, {onDelete: 'CASCADE'})
    users: User[]

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    ipdatedAt: Date;
}