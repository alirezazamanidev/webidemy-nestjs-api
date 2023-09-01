import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course } from 'src/common/interfaces/course.intreface';
import { CreateCourseDTO } from '../admin/dto/admin.dto';
import * as path from 'path';
import * as sharp from 'sharp';
import slugify from 'slugify';
import { Messages } from 'src/common/enums/message.enum';
@Injectable()
export class CourseService {
  constructor(@InjectModel('Course') private courseModel: Model<Course>) {}

  async store(courseDTO: CreateCourseDTO) {
    const {
      title,
      body,
      description,
      condition,
      file,
      fromColor,
      toColor,
      tags,
      user,
      type,
      price,
    } = courseDTO;

    const images = await this.ResizeImage(file);

    const course = await this.courseModel.findOne({ title });
    if (course) throw new BadRequestException(Messages);

    const newCourse = new this.courseModel({
      teacher: user.id,
      title,
      gradientColorCard: {
        fromColor,
        toColor,
      },
      slug: slugify(title, '-'),
      body,
      condition,
      price,
      type,
      description,
      photos: images,
      tags,
    });
    return await newCourse.save();
  }
  private ResizeImage(image: Express.Multer.File) {
    const imageInfo = path.parse(image.path);
    const addressImages = {};

    addressImages['original'] = this.getUrlImage(
      `${image.destination}/${image.filename}`,
    );

    const resize = (size: number) => {
      const imageName = `${imageInfo.name}-${size}${imageInfo.ext}`;
      addressImages[size] = this.getUrlImage(
        `${image.destination}/${imageName}`,
      );

      sharp(image.path)
        .resize(size, null)
        .toFile(`${image.destination}/${imageName}`);
    };

    [360, 480, 720, 1080].map(resize);

    return addressImages;
  }
  private getUrlImage(dir: string) {
    return dir.substring(8);
  }
}
