import { Module } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from './post.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity])],
  controllers: [PostsController],
  providers: [
    {
      provide: PostsService,
      useFactory: (postRepository: Repository<PostEntity>) =>
        new PostsService(postRepository),
      inject: [getRepositoryToken(PostEntity)],
    },
  ],
  exports: [PostsService],
})
export class PostsModule {}
