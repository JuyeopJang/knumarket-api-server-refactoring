import {Entity, PrimaryGeneratedColumn, Column, Index} from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    user_uid: string;

    @Index()
    @Column({ length: 50 })
    email: string;

    @Column({ length: 255 })
    password: string;

    @Column({ length: 20 })
    nickname: string;

    @Column({ default: false })
    is_verified: boolean;

    @Column()
    created_at: Date;
    
    @Column()
    updated_at: Date;

}