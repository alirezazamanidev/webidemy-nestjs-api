import { Controller, Get, HttpCode, HttpStatus, Param, Put, Query } from '@nestjs/common';
import { BlogService } from '../services/blog.service';
import { Auth } from 'src/common/decorators/Auth.decorator';
import { User } from 'src/common/decorators/User.decorator';
import { JwtPayload } from '../../auth/types/jwtpayload.type';
import mongoose, { ObjectId } from 'mongoose';
import { FilterQueryDTO } from '../dtos/home.dto';

@Controller({
    path: 'blogs',
    version: '1'
})
export class BlogController {
    constructor(private blogService: BlogService) { }
    @HttpCode(HttpStatus.OK)
    @Get('filter')
    async FilterCurse(@Query() query:FilterQueryDTO) {
      return await this.blogService.FindByFilter(query);
    }

  
    @HttpCode(HttpStatus.OK)
    @Get('')
    async Index() {
        return {
            status: 'success',
            blogs: await this.blogService.index()
        }
    }

    @HttpCode(HttpStatus.OK)
    @Auth()
    @Get('/saved/:blogId')
    async SavedBlog(@Param('blogId') blogId: mongoose.Types.ObjectId, @User() user: JwtPayload) {
        return await this.blogService.savedBlog(user.id, blogId);
    }
    @HttpCode(HttpStatus.OK)
    @Auth()
    @Put('liked/:blogId')
    async ToogleLikeBlog(@Param('blogId') blogId, @User() user: JwtPayload) {
        return await this.blogService.updateLiked(user?.id, blogId);
    }

    @HttpCode(HttpStatus.OK)
    @Get(':slug')
    async GetSingleBlog(@Param('slug') blogSlug:string){
        return {
            status:'success',
            blog:await this.blogService.singleBlog(blogSlug)
        }
    }
}
