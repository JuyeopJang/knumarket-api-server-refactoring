import { AddImageDto } from "./AddImageDto";

export class AddPostDto {
  title: string;
  description: string;
  location: number;
  max_head_count: number;
  images: AddImageDto[];
  userUid: string;
}