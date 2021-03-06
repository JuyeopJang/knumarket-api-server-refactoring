import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, AfterInsert} from "typeorm";
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

    @ManyToMany(() => User, user => user.post_rooms)
    @JoinTable()
    users: User[]

    @Column({ default: () => 'CURRENT_TIMESTAMP '})
    created_at: Date;
    
    @Column({ default: () => 'CURRENT_TIMESTAMP '})
    updated_at: Date;
}