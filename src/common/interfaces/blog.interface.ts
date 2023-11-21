import mongoose, { Document, ObjectId } from "mongoose";
import { User } from "./user.interface";

export interface Blog extends Document {
    id: mongoose.Types.ObjectId;
    
    author: User
    category:string;
    title: string
    description: string
    isPublished: boolean
    slug: string
    inc:(fild:string,num?:number)=>void
    studyTime: string
    photos: {}
    tags: string;
    GradientCardBlog: {
        toColor: string;
        fromColor: string;
    },
    likedUserList:string[];
    likeCount: number;
    viewCount: number;
    bookMarkedCount:number;
    commentCount: number;

}