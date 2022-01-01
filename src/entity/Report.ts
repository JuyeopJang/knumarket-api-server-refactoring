import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    report_uid: string;

    @Column({ length: 50 })
    title: string;

    @Column({ length: 500 })
    description: string;

    @Column()
    user_uid: string;

    @Column()
    created_at: Date;

}