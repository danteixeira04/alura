import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreatePostDto } from './create-post.dto';
import { PostsService } from './posts.service';
import { UpdatePostDto } from './update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('tag') tag?: string,
  ) {
    return this.postsService.findAll({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search,
      tag,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(
    @Req() req: { user: { id: string; name: string; email: string } },
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postsService.create(createPostDto, req.user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Req() req: { user: { id: string; name: string; email: string } },
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(id, updatePostDto, req.user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(
    @Req() req: { user: { id: string; name: string; email: string } },
    @Param('id') id: string,
  ) {
    await this.postsService.remove(id, req.user);
    return { deleted: true };
  }
}
