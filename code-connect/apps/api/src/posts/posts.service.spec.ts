import { ForbiddenException, NotFoundException } from '@nestjs/common';
import type { Post } from './posts.service';
import { PostsService } from './posts.service';

describe('PostsService', () => {
  let service: PostsService;

  beforeEach(() => {
    service = new PostsService();
  });

  it('returns the seeded posts list', async () => {
    const posts = (await service.findAll()) as Post[];

    expect(Array.isArray(posts)).toBe(true);
    expect(posts).toHaveLength(2);
    expect(posts[0].title).toBe('Boas práticas em APIs REST');
  });

  it('creates a post and stores it in the list', async () => {
    const created = await service.create({
      title: 'Documentação de equipe',
      content:
        'Documentar decisões de arquitetura ajuda a manter ritmo saudável.',
      author: 'Beatriz',
      tags: ['docs', 'team'],
    });

    expect(created.title).toBe('Documentação de equipe');
    const posts = (await service.findAll()) as Post[];
    expect(posts[0].id).toBe(created.id);
  });

  it('uses the authenticated user as the default author', async () => {
    const created = await service.create(
      {
        title: 'Ajustes de API',
        content: 'Ajustar o ciclo de revisão melhora a qualidade do produto.',
        tags: ['api'],
      },
      { id: 'user-1', name: 'Carol', email: 'carol@codeconnect.com' },
    );

    expect(created.author).toBe('Carol');
    expect(created.authorUserId).toBe('user-1');
  });

  it('returns a paginated and filtered result set', async () => {
    const result = await service.findAll({
      page: 1,
      limit: 1,
      search: 'react',
      tag: 'react',
    });

    expect(result).toMatchObject({
      items: [{ title: 'React + Nest em monorepo' }],
      total: 1,
      page: 1,
      limit: 1,
      totalPages: 1,
    });
  });

  it('prevents another user from editing a post they do not own', async () => {
    const created = await service.create(
      {
        title: 'Post protegido',
        content: 'Este conteúdo pertence a um único autor.',
        tags: ['security'],
      },
      { id: 'user-1', name: 'Carol', email: 'carol@codeconnect.com' },
    );

    await expect(
      service.update(
        created.id,
        { title: 'Tentativa de edição' },
        {
          id: 'user-2',
          name: 'Outro',
          email: 'outro@codeconnect.com',
        },
      ),
    ).rejects.toThrow(ForbiddenException);
  });

  it('throws when the requested post does not exist', async () => {
    await expect(service.findOne('missing-id')).rejects.toThrow(
      NotFoundException,
    );
  });
});
