import { Image } from "../../../entity/Image";

export class AddPostDto {
    title: string;
    description: string;
    location: number;
    max_head_count: number;
    images: Image[];
}