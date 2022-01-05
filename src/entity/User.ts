import {Entity, PrimaryGeneratedColumn, Column, Index, Timestamp} from "typeorm";
import { IsEmail } from 'class-validator';

@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    user_uid: string;

    @Index()
    @Column({ length: 50 })
    @IsEmail()
    email: string;

    @Column({ length: 255 })
    password: string;

    @Column({ length: 20 })
    nickname: string;

    @Column({ default: false })
    is_verified: boolean;

    @Column({ default: () => 'CURRENT_TIMESTAMP '})
    created_at: Date;
    
    @Column({ default: () => 'CURRENT_TIMESTAMP '})
    updated_at: Date;

}