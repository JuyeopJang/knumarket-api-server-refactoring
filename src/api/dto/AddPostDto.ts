import { Image } from "../../entity/Image";
import { User } from "../../entity/User";
import { AddPostRoomDto } from "./AddPostRoomDto";

export class AddPostDto {
    title: string;
    description: string;
    location: number;
    max_head_count: number;
    images: Image[];
    postRoom: AddPostRoomDto;
    user: User;
}