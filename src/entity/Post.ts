import {Entity, PrimaryGeneratedColumn, Column, Index, Timestamp, DeleteDateColumn, ManyToOne, OneToMany} from "typeorm";
import { User } from "./User";
import { Image } from "./Image";

@Entity()
export class Post {

    @PrimaryGeneratedColumn('uuid')
    post_uid: string;

    @Column({ length: 50 })
    title: string;

    @Column({ length: 500 })
    description: string;

    @Column()
    location: number;

    @Column()
    max_head_count: number;

    @Column()
    is_archived: boolean;

    @ManyToOne(() => User, user => user.posts, {
        onDelete: 'CASCADE'
    })
    user: User;

    @OneToMany(() => Image, image => image.post, {
        cascade: ["insert", "remove"]
    })
    images: Image[]

    @Column({ default: () => 'CURRENT_TIMESTAMP '})
    created_at: Date;
    
    @Column({ default: () => 'CURRENT_TIMESTAMP '})
    updated_at: Date;
}