import { IsNotEmpty } from 'class-validator';
import { User } from 'src/common/interfaces/user.interface';
export class CreateCourseDTO {
  @IsNotEmpty()
  user: User;
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  body: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  file: Express.Multer.File;
  @IsNotEmpty()
  condition: string;
  @IsNotEmpty()
  price: string;
  @IsNotEmpty()
  fromColor: string;
  @IsNotEmpty()
  toColor: string;

  @IsNotEmpty()
  tags: string;
  @IsNotEmpty()
  type: string;
}
export class UpdateCourseDTO {
  @IsNotEmpty()
  user: User;
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  body: string;
  @IsNotEmpty()
  description: string;
  file?: Express.Multer.File;
  @IsNotEmpty()
  condition: string;
  @IsNotEmpty()
  price: string;
  @IsNotEmpty()
  fromColor: string;
  @IsNotEmpty()
  toColor: string;

  @IsNotEmpty()
  tags: string;
  @IsNotEmpty()
  type: string;
}
