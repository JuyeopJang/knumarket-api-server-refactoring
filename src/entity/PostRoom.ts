import {Entity, PrimaryGeneratedColumn, Column, Index, Timestamp, DeleteDateColumn, ManyToMany} from "typeorm";
import { IsEmail } from 'class-validator';
import { User } from "./User";

@Entity()
export class PostRoom {

    @PrimaryGeneratedColumn('uuid')
    post_room_uid: string;

    @Column({ length: 50 })
    title: string;

    @Column()
    max_head_count: number;

    @Column()
    current_head_count: number;

    @Index()
    @Column()
    post_uid: string;

    @ManyToMany(() => User, user => user.post_rooms)
    users: User[]

    @Column({ default: () => 'CURRENT_TIMESTAMP '})
    created_at: Date;
    
    @Column({ default: () => 'CURRENT_TIMESTAMP '})
    updated_at: Date;
}