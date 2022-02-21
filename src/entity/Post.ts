import {Entity, PrimaryGeneratedColumn, Column, Index, Timestamp, DeleteDateColumn, ManyToOne, OneToMany, OneToOne, JoinColumn} from "typeorm";
import { User } from "./User";
import { Image } from "./Image";
import { PostRoom } from "./PostRoom";

@Entity()
export class Post {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ length: 50 })
    title: string;

    @Column({ length: 500 })
    description: string;

    @Column()
    location: number;

    @Column()
    max_head_count: number;

    @Column({ default: false })
    is_archived: boolean;

    @OneToOne(() => PostRoom)
    @JoinColumn()
    post_room: PostRoom;

    @ManyToOne(() => User, user => user.posts)
    user: User;

    @OneToMany(() => Image, image => image.post)
    images: Image[]

    @Column({ default: () => 'CURRENT_TIMESTAMP '})
    created_at: Date;
    
    @Column({ default: () => 'CURRENT_TIMESTAMP '})
    updated_at: Date;
}