import { IsNotEmpty } from 'class-validator';
import { User } from 'src/common/interfaces/user.interface';

export class LoginUserAdminDTO {
  email: string;
  adminPassword: string;
}
export class CourseDTO {
  @IsNotEmpty()
  category: string;
  @IsNotEmpty()
  user: User;
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  body: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  fromColor:string
  @IsNotEmpty()
  toColor:string
  @IsNotEmpty()
  file: Express.Multer.File;
  @IsNotEmpty()
  condition: string;
  @IsNotEmpty()
  price: string;
  @IsNotEmpty()
  tags: string;
  @IsNotEmpty()
  type: string;
}
export class UpdateCourseDTO {
  @IsNotEmpty()
  user: User;
  @IsNotEmpty()
  category: string;

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
export class createSeasonDTO {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  number: number;
  @IsNotEmpty()
  course: string;
}
export class CreateEpisodeDTO {
  @IsNotEmpty()
  season: string;
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  body: string;
  @IsNotEmpty()
  type: string;
  @IsNotEmpty()
  file: Express.Multer.File;
  @IsNotEmpty()
  time: number;
  @IsNotEmpty()
  number: number;
}

export class EditSeasonDTO {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  number: string;
  @IsNotEmpty()
  course: string;
}

export class UpdateEpisodeDTO {
  @IsNotEmpty()
  season: string;
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  body: string;
  @IsNotEmpty()
  type: string;
  @IsNotEmpty()
  file?: Express.Multer.File;
  @IsNotEmpty()
  time: number;
  @IsNotEmpty()
  number: number;
}

export class createCategoryDTO {
  @IsNotEmpty()
  title: string;
}
