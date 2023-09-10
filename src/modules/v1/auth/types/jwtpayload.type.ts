export type JwtPayload = {
  id: string;
  username: string;
  fullname: string;
  phone: string;
  email: string;
  biography: string;
  avatar?: string;
  active: boolean;
  admin: boolean;
};
