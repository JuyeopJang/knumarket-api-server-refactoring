import { Image } from "../../entity/Image";

export class PostPaginationDto {
    id: number;
    title: string;
    images: Image[];
    created_at: Date;
}