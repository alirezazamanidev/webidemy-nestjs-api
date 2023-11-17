export type JwtPayload = {
  id: string;
  username: string;
  fullname: string;
  phone: string;
  email: string;
  biography: string;
  savedBlogList:string[]
  avatar?: string;
  role: string;
  active: boolean;
  isAdmin: boolean;
};
