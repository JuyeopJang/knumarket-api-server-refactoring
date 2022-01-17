import {Entity, PrimaryGeneratedColumn, Column, Index, Timestamp, DeleteDateColumn, ManyToOne} from "typeorm";
import { IsEmail } from 'class-validator';
import { Post } from "./Post";

@Entity()
export class Image {

    @PrimaryGeneratedColumn('uuid')
    image_uid: string;

    @Column({ length: 255 })    
    url: string;

    @ManyToOne(() => Post, post => post.images, {
        onDelete: 'CASCADE'
    })
    post: Post

    @Column({ default: () => 'CURRENT_TIMESTAMP '})
    created_at: Date;
}