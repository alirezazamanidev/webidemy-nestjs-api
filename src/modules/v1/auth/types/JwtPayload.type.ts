export type JWTpayload = {
  id: string;
  fullname: string;
  username: string;
  phone: string;
  avatar?: string;
  admin: boolean;
  active: boolean;
};
