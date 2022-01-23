import {Entity, PrimaryGeneratedColumn, Column, Index, Timestamp, DeleteDateColumn, ManyToMany, OneToOne, JoinColumn} from "typeorm";
import { Post } from "./Post";
// import { IsEmail } from 'class-validator';
import { User } from "./User";

@Entity()
export class PostRoom {

    @PrimaryGeneratedColumn('uuid')
    post_room_uid: string;

    @Column({ length: 50 })
    title: string;

    @Column()
    max_head_count: number;

    @Column({
        default: 1
    })
    current_head_count: number;

    @ManyToMany(() => User, user => user.post_rooms, {
        eager: true,
        cascade: ["insert", "remove", "update"]
    })
    users: User[]

    @Column({ default: () => 'CURRENT_TIMESTAMP '})
    created_at: Date;
    
    @Column({ default: () => 'CURRENT_TIMESTAMP '})
    updated_at: Date;
}