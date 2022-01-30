import { Image } from "../../entity/Image";
import { PostRoom } from "../../entity/PostRoom";
import { User } from "../../entity/User";

export class AddPostDto {
    title: string;
    description: string;
    location: number;
    max_head_count: number;
    images: Image[];
    postRoom: PostRoom;
    user: User;
}