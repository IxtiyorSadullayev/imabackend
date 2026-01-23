import { Column, CreateDateColumn, Entity, ManyToOne,  OneToMany,  PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserType } from "./usertype.entity";
import { ClassName } from "./className.entity";
import { Yuqlama } from "src/yuqlama/entities/yuqlama.entity";

@Entity()
export class User {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({default: ""})
    login: string;

    @Column({default: ""})
    password: string;

    @Column()
    fullname: string;

    @Column({default: ""})
    pas_seria: string;

    @Column({default: ""})
    pas_number: string;

    @Column({default: ""})
    jinsi: string;

    @Column()
    birthday: Date;

    @Column({default: ""})
    phoneNumber: string;

    @Column({default: ""})
    imgUrl: string;

    @OneToMany(() => Yuqlama, (yuqlama) => yuqlama.user)
    yuqlamalar: Yuqlama[];

    @ManyToOne(()=> UserType, (usertype) => usertype.users)
    userType: UserType
    
    @ManyToOne(()=> ClassName, classname => classname.classname)
    className: ClassName

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
} 
