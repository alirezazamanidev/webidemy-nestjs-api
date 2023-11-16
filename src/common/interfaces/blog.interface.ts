import { Document } from "mongoose";
import { User } from "./user.interface";

export interface Blog extends Document {
    id: string;
    author: User
    title: string
    description: string
    isPublished: boolean
    slug: string
    studyTime: string
    photos: {}
    tags: string;
    GradientCardBlog: {
        toColor: string;
        fromColor: string;
    },
    likeCount: number;
    viewCount: number;
    commentCount: number;

}