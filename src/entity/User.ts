import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    user_uid: number;

    @Column({ length: 50 })
    email: string;

    @Column({ length: 255 })
    password: string;

    @Column({ length: 20 })
    nickname: string;

    @Column()
    is_verified: boolean;

    @Column()
    created_at: Date;
    
    @Column()
    updated_at: Date;

}