import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Button } from '../../atoms/Button';
import type { CreatePostInput, Post } from '../../../types/post';

type PostCardProps = {
  post: Post;
  onDelete: (id: string) => Promise<void> | void;
  onSave: (id: string, payload: Partial<CreatePostInput>) => Promise<void> | void;
};

export function PostCard({ post, onDelete, onSave }: PostCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    title: post.title,
    content: post.content,
    author: post.author,
    tags: post.tags.join(', '),
  });

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSave(post.id, {
      title: form.title.trim(),
      content: form.content.trim(),
      author: form.author.trim(),
      tags: form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Título
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-violet-500 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Conteúdo
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                rows={4}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-violet-500 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Autor
              <input
                name="author"
                value={form.author}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-violet-500 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Tags
              <input
                name="tags"
                value={form.tags}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-violet-500 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
              />
            </label>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </article>
    );
  }

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-violet-600 dark:text-violet-400">
            {post.author}
          </p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
            {post.title}
          </h3>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {new Date(post.createdAt).toLocaleDateString('pt-BR')}
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-700 dark:text-slate-300">
        {post.content}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span
            key={`${post.id}-${tag}`}
            className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700 dark:bg-violet-950 dark:text-violet-200"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="mt-5 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={() => setIsEditing(true)}>
          Editar
        </Button>
        <Button type="button" variant="secondary" onClick={() => void onDelete(post.id)}>
          Excluir
        </Button>
      </div>
    </article>
  );
}
