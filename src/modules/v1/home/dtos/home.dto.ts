export class FilterQueryDTO {
  sort: string;
  page?: string;
  limit: string;
  search?: string;
  category: string;
}
export class EditProfileUserDtO {
  fullname: string;
  email: string;
  biography: string;
  username: string;
  phone: string;
}

export class createCommentDTO {
  user: string;
  course: string;
  episode: string;
  comment: string;
}
export class AnswerCommentDTO {
  user: string;
  subject:{
    episode?:string;
    course?:string;

  }
  comment: string;
  parent: string;
}
export class CommentDTO {
  subject: {
    course?: string;
    episode?: string;
  };
  page: number;
  limit: number;
}
export class StoreOrder {
  user: string;
  course: string;
}
