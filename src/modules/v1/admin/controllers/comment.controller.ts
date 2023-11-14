import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { BasePaginateDTO } from 'src/common/dtos/base-paginate.dto';
import { AnswerCommentDTO } from '../../home/dtos/home.dto';
import { Auth } from 'src/common/decorators/Auth.decorator';
import { CommentService } from '../services/comment.service';
import { User } from 'src/common/decorators/User.decorator';
import { JwtPayload } from '../../auth/types/jwtpayload.type';

@Auth()
@Controller({
  path: '/admin/comments',
  version: '1',
})
export class CommentController {
  constructor(private commentService: CommentService) {}
  @HttpCode(HttpStatus.OK)
  @Get('')
  async Index(@Query() BasePaginateDTO: BasePaginateDTO,@User() user:JwtPayload) {
    return await this.commentService.index(
      BasePaginateDTO,
      user
    );
  }
  // @HttpCode(HttpStatus.OK)
  // @Post('/approved')
  // async Approved(@Body() commentDTO: AnswerCommentDTO, @Req() req) {
  //   return this.commentService.approved(commentDTO, req.user.id);
  // }
  // @HttpCode(HttpStatus.OK)
  // @Get()
  // async IndexApproved(@Query() BasePaginateDTO: BasePaginateDTO,@User() user:JwtPayload) {
  //   return await this.commentService.paginateShowCommentsApproved(
  //     BasePaginateDTO,
  //     user
      
  //   );
  // }
  @HttpCode(HttpStatus.OK)
  @Delete(':commentId')
  async DeleteOne(@Param('commentId') commentId: string) {
    return await this.commentService.destroy(commentId);
  }
}
