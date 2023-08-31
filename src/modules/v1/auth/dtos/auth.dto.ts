import { IsNotEmpty, Matches } from 'class-validator';
import { Messages } from 'src/common/enums/message.enum';
export class RegisterDTO {
  @IsNotEmpty({
    message: Messages.EMPTY_FULL_NAME,
  })
  fullname: string;
  @Matches(/^09\d{9}$/, {
    message: 'لطفاً یک شماره موبایل معتبر وارد کنید',
  })
  @IsNotEmpty({
    message: Messages.EMPTY_PHONE_USER,
  })
  phone: string;
}
export class LoginDTO {
  @Matches(/^09\d{9}$/, {
    message: 'لطفاً یک شماره موبایل معتبر وارد کنید',
  })
  @IsNotEmpty({
    message: Messages.EMPTY_PHONE_USER,
  })
  phone: string;
}
