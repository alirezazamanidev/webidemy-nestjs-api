export class SearchCourseQueryDTO {
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
  course: string;
  episode: string;
  comment: string;
  parent: string;
}
