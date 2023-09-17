export type JwtPayload = {
  id: string;
  username: string;
  fullname: string;
  phone: string;
  email: string;
  biography: string;
  avatar?: string;
  role: string;
  active: boolean;
  isAdmin: boolean;
};
