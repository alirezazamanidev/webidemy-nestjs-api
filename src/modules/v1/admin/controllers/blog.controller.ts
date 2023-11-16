import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
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
    @HttpCode(HttpStatus.OK)
    @Delete(':blogId')
    async deleteOne(@Param('blogId') blogId:string){
        return await this.blogService.destroy(blogId);
    }
    @HttpCode(HttpStatus.OK)
    @Get('/edit/:blogId')
    async Edit(@Param('blogId') blogId:string){
            
        return {
            status:"success",
            blog: await this.blogService.edit(blogId)
        }

    }
    @HttpCode(HttpStatus.OK)
    @Put('published/:blogId')
    async UpdatePublished(@Param('blogId') blogId:string){
        return await this.blogService.updatePublished(blogId);
    }
}
