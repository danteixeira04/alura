import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreatePostDto } from './create-post.dto';
import { PostEntity } from './post.entity';
import { UpdatePostDto } from './update-post.dto';

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
};

export type PostQuery = {
  page?: number;
  limit?: number;
  search?: string;
  tag?: string;
};

export type PaginatedPosts = {
  items: Post[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  author: string;
  authorUserId?: string;
  tags: string[];
  createdAt: string;
};

@Injectable()
export class PostsService implements OnModuleInit {
  private readonly posts: Post[] = [
    {
      id: '1',
      title: 'Boas práticas em APIs REST',
      content:
        'Ao modelar endpoints, vale priorizar nomes collection-based, respostas consistentes e status http claros para cada operação.',
      author: 'Ana Souza',
      authorUserId: 'demo-user',
      tags: ['rest', 'backend', 'api'],
      createdAt: '2026-08-20T01:00:00.000Z',
    },
    {
      id: '2',
      title: 'React + Nest em monorepo',
      content:
        'Separar frontend e backend em workspaces facilita manutenção, build e deploy independentes sem perder alinhamento entre times.',
      author: 'Bruno Costa',
      authorUserId: 'demo-user',
      tags: ['react', 'nestjs', 'monorepo'],
      createdAt: '2026-08-20T01:15:00.000Z',
    },
  ];

  constructor(private readonly postRepository?: Repository<PostEntity>) {}

  async onModuleInit(): Promise<void> {
    if (!this.postRepository) {
      return;
    }

    const count = await this.postRepository.count();

    if (count > 0) {
      return;
    }

    const seedPosts: Partial<PostEntity>[] = [
      {
        id: '1',
        title: 'Boas práticas em APIs REST',
        content:
          'Ao modelar endpoints, vale priorizar nomes collection-based, respostas consistentes e status http claros para cada operação.',
        author: 'Ana Souza',
        authorUserId: 'demo-user',
        tags: ['rest', 'backend', 'api'],
        createdAt: new Date('2026-08-20T01:00:00.000Z'),
      },
      {
        id: '2',
        title: 'React + Nest em monorepo',
        content:
          'Separar frontend e backend em workspaces facilita manutenção, build e deploy independentes sem perder alinhamento entre times.',
        author: 'Bruno Costa',
        authorUserId: 'demo-user',
        tags: ['react', 'nestjs', 'monorepo'],
        createdAt: new Date('2026-08-20T01:15:00.000Z'),
      },
    ];

    await this.postRepository.save(this.postRepository.create(seedPosts));
  }

  async findAll(query?: PostQuery): Promise<Post[] | PaginatedPosts> {
    const page = Math.max(1, Number(query?.page ?? 1));
    const limit = Math.max(1, Math.min(Number(query?.limit ?? 5), 20));
    const search = (query?.search ?? '').trim().toLowerCase();
    const tag = (query?.tag ?? '').trim().toLowerCase();

    const applyFilters = (items: Post[]): Post[] => {
      let filtered = [...items];

      if (search) {
        filtered = filtered.filter((post) =>
          [post.title, post.content, post.author, post.tags.join(' ')]
            .join(' ')
            .toLowerCase()
            .includes(search),
        );
      }

      if (tag) {
        filtered = filtered.filter((post) =>
          post.tags.some((postTag) => postTag.toLowerCase().includes(tag)),
        );
      }

      return filtered;
    };

    if (this.postRepository) {
      const rows = await this.postRepository.find({
        order: { createdAt: 'DESC' },
        relations: { authorUser: true },
      });

      const items = rows.map((post) => this.normalizeEntity(post));
      const filtered = applyFilters(items);
      const total = filtered.length;
      const totalPages = Math.max(1, Math.ceil(total / limit));
      const safePage = Math.min(page, totalPages);
      const start = (safePage - 1) * limit;
      const paginatedItems = filtered.slice(start, start + limit);

      if (!query || Object.keys(query).length === 0) {
        return paginatedItems;
      }

      return {
        items: paginatedItems,
        total,
        page: safePage,
        limit,
        totalPages,
      };
    }

    const filtered = applyFilters([...this.posts]);
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * limit;
    const paginatedItems = filtered.slice(start, start + limit);

    if (!query || Object.keys(query).length === 0) {
      return paginatedItems;
    }

    return {
      items: paginatedItems,
      total,
      page: safePage,
      limit,
      totalPages,
    };
  }

  async findOne(id: string): Promise<Post> {
    if (this.postRepository) {
      const post = await this.postRepository.findOne({
        where: { id },
        relations: { authorUser: true },
      });

      if (!post) {
        throw new NotFoundException(`Post ${id} not found`);
      }

      return this.normalizeEntity(post);
    }

    const post = this.posts.find((item) => item.id === id);

    if (!post) {
      throw new NotFoundException(`Post ${id} not found`);
    }

    return post;
  }

  async create(post: CreatePostDto, currentUser?: CurrentUser): Promise<Post> {
    const resolvedAuthor =
      post.author?.trim() || currentUser?.name || 'Usuário anônimo';
    const created: Post = {
      id: crypto.randomUUID(),
      title: post.title,
      content: post.content,
      author: resolvedAuthor,
      authorUserId: currentUser?.id,
      tags: post.tags ?? [],
      createdAt: new Date().toISOString(),
    };

    if (this.postRepository) {
      const saved = await this.postRepository.save(
        this.postRepository.create({
          title: created.title,
          content: created.content,
          author: created.author,
          authorUserId: created.authorUserId,
          tags: created.tags,
          createdAt: new Date(created.createdAt),
        }),
      );

      return this.normalizeEntity(saved);
    }

    this.posts.unshift(created);
    return created;
  }

  async update(
    id: string,
    payload: UpdatePostDto,
    currentUser?: CurrentUser,
  ): Promise<Post> {
    if (this.postRepository) {
      const post = await this.postRepository.findOne({
        where: { id },
        relations: { authorUser: true },
      });

      if (!post) {
        throw new NotFoundException(`Post ${id} not found`);
      }

      if (
        currentUser &&
        post.authorUserId &&
        post.authorUserId !== currentUser.id
      ) {
        throw new ForbiddenException(
          'Você só pode editar suas próprias publicações.',
        );
      }

      const updated = await this.postRepository.save({
        ...post,
        title: payload.title ?? post.title,
        content: payload.content ?? post.content,
        author:
          payload.author?.trim() ||
          post.author ||
          currentUser?.name ||
          'Usuário anônimo',
        tags: payload.tags ?? post.tags ?? [],
        authorUserId: post.authorUserId ?? currentUser?.id,
      });

      return this.normalizeEntity(updated);
    }

    const index = this.posts.findIndex((post) => post.id === id);

    if (index === -1) {
      throw new NotFoundException(`Post ${id} not found`);
    }

    if (
      currentUser &&
      this.posts[index].authorUserId &&
      this.posts[index].authorUserId !== currentUser.id
    ) {
      throw new ForbiddenException(
        'Você só pode editar suas próprias publicações.',
      );
    }

    this.posts[index] = {
      ...this.posts[index],
      ...payload,
      author: payload.author?.trim() || this.posts[index].author,
      authorUserId: this.posts[index].authorUserId ?? currentUser?.id,
      tags: payload.tags ?? this.posts[index].tags,
    };

    return this.posts[index];
  }

  async remove(id: string, currentUser?: CurrentUser): Promise<void> {
    if (this.postRepository) {
      const post = await this.postRepository.findOne({
        where: { id },
        relations: { authorUser: true },
      });

      if (!post) {
        throw new NotFoundException(`Post ${id} not found`);
      }

      if (
        currentUser &&
        post.authorUserId &&
        post.authorUserId !== currentUser.id
      ) {
        throw new ForbiddenException(
          'Você só pode remover suas próprias publicações.',
        );
      }

      const result = await this.postRepository.delete(id);

      if (result.affected === 0) {
        throw new NotFoundException(`Post ${id} not found`);
      }

      return;
    }

    const index = this.posts.findIndex((post) => post.id === id);

    if (index === -1) {
      throw new NotFoundException(`Post ${id} not found`);
    }

    if (
      currentUser &&
      this.posts[index].authorUserId &&
      this.posts[index].authorUserId !== currentUser.id
    ) {
      throw new ForbiddenException(
        'Você só pode remover suas próprias publicações.',
      );
    }

    this.posts.splice(index, 1);
  }

  private normalizeEntity(post: PostEntity): Post {
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      author: post.authorUser?.name ?? post.author ?? 'Usuário anônimo',
      authorUserId: post.authorUserId,
      tags: post.tags ?? [],
      createdAt:
        post.createdAt instanceof Date
          ? post.createdAt.toISOString()
          : post.createdAt,
    };
  }
}
