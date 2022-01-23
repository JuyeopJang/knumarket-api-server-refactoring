import { AddPostDto } from "./AddPostDto";

export class UpdatePostDto extends AddPostDto {
    isArchived: boolean;
}