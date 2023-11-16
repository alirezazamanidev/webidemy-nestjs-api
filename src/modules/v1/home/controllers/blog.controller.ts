import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { BlogService } from '../services/blog.service';

@Controller({
    path:'blogs',
    version:'1'
})
export class BlogController {
    constructor(private blogService:BlogService){}
    @HttpCode(HttpStatus.OK)
    @Get('')
    async Index(){
        return {
            status:'success',
            blogs:await this.blogService.index()
        }
    }
}
