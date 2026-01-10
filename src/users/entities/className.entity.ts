import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class ClassName{

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    classname: string;

    @Column()
    description: string;

    @OneToMany(()=> User, user=> user.className, {onDelete: 'CASCADE'})
    users: User[]

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}