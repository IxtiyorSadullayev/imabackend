import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Yuqlama {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User, (user) => user.yuqlamalar, { eager: true })
    user: User;

    @Column()
    come: String;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;
}
