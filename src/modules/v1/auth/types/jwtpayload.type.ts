export type JwtPayload = {
  id: string;
  username: string;
  fullname: string;
  phone: string;
  email: string;
  avatar?: string;
  active: boolean;
  admin: boolean;
};
