import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Auth } from 'src/common/decorators/Auth.decorator';
import { GetCurrentComment } from 'src/common/decorators/get-current-comment.decorator';
import { CommentDTO, createCommentDTO } from '../dtos/home.dto';
import { CommentService } from '../services/comment.service';

@Controller({
  path: 'comments',
  version: '1',
})
export class CommentController {
  constructor(private commentService: CommentService) {}
  @Auth()
  @HttpCode(HttpStatus.OK)
  @Post('/create')
  async create(@GetCurrentComment() commentDTO: createCommentDTO) {
    return this.commentService.store(commentDTO);
  }

  @HttpCode(HttpStatus.OK)
  @Post()
  async GetComments(@Body() commentDTO: CommentDTO) {
    return await this.commentService.getComments(commentDTO);
  }
}
