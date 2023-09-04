import { JwtPayload } from './jwtpayload.type';

export type JwtpayloadWithRt = JwtPayload & { refresh_token: string };
