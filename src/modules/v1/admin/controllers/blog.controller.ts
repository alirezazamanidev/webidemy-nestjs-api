import { Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { BlogService } from '../services/blog.service';
import { BasePaginateDTO } from 'src/common/dtos/base-paginate.dto';
import { User } from 'src/common/decorators/User.decorator';
import { JwtPayload } from '../../auth/types/jwtpayload.type';
import { Auth } from 'src/common/decorators/Auth.decorator';
import { UploadPhotoBlogFile } from 'src/common/decorators/uploadFile.decorator';
import { GetCurrentBlog } from 'src/common/decorators/get-current-blog.decorator';
import { BlogDTO } from '../dto/admin.dto';

@Auth()
@Controller({
    path:'/admin/blogs',
    version:'1'
})
export class BlogController {
    constructor(private blogService:BlogService){}
    
    @HttpCode(HttpStatus.OK)
    @Get()
    async Index(@Query() BasePaginateDTO:BasePaginateDTO,@User() user:JwtPayload){
        return await this.blogService.index(BasePaginateDTO,user.id);
    }
    @HttpCode(HttpStatus.CREATED)
    @Post('/create')
    @UploadPhotoBlogFile('photo')
    async Store(@GetCurrentBlog() BlogDTO:BlogDTO){
        return await this.blogService.store(BlogDTO)
    }
}
