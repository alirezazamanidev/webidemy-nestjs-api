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
import { CommentService } from '../../comment/comment.service';
import { AnswerCommentDTO } from '../../home/dtos/home.dto';
import { Auth } from 'src/common/decorators/Auth.decorator';

@Auth()
@Controller({
  path: '/admin/comments',
  version: '1',
})
export class CommentController {
  constructor(private commentService: CommentService) {}
  @HttpCode(HttpStatus.OK)
  @Get('/approved')
  async IndexNotApproved(@Query() BasePaginateDTO: BasePaginateDTO) {
    return await this.commentService.paginateShowCommentsNotApproved(
      BasePaginateDTO,
    );
  }
  @HttpCode(HttpStatus.OK)
  @Post('/approved')
  async Approved(@Body() commentDTO: AnswerCommentDTO, @Req() req) {
    return this.commentService.approved(commentDTO, req.user.id);
  }
  @HttpCode(HttpStatus.OK)
  @Get()
  async IndexApproved(@Query() BasePaginateDTO: BasePaginateDTO) {
    return await this.commentService.paginateShowCommentsApproved(
      BasePaginateDTO,
    );
  }
  @HttpCode(HttpStatus.OK)
  @Delete(':commentId')
  async DeleteOne(@Param('commentId') commentId: string) {
    return await this.commentService.destroy(commentId);
  }
}
