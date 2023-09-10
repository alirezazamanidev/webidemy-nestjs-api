import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Auth } from 'src/common/decorators/Auth.decorator';
import { GetCurrentComment } from 'src/common/decorators/get-current-comment.decorator';
import { createCommentDTO } from '../dtos/home.dto';
import { CommentService } from '../../comment/comment.service';

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
    return this.commentService.comment(commentDTO);
  }
}
