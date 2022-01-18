import {Entity, PrimaryGeneratedColumn, Column, Index, Timestamp, DeleteDateColumn, OneToMany, ManyToMany} from "typeorm";
import { IsEmail } from 'class-validator';
import { Post } from "./Post";
import { PostRoom } from "./PostRoom";
import { unique } from "faker";

@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    user_uid: string;

    @Index(unique)
    @Column({ length: 50 })
    @IsEmail()
    email: string;

    @Column({ length: 255 })
    password: string;

    @Column({ length: 20 })
    nickname: string;

    @Column({ default: false })
    is_verified: boolean;

    @OneToMany(() => Post, post => post.user, {
        cascade: ["insert", "remove"],
        eager: true
    })
    posts: Post[]

    @ManyToMany(() => PostRoom, postRoom => postRoom.users, {
        cascade: ["insert", "remove"]
    })
    post_rooms: PostRoom[]

    @Column({ default: () => 'CURRENT_TIMESTAMP '})
    created_at: Date;
    
    @Column({ default: () => 'CURRENT_TIMESTAMP '})
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}