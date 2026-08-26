import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Button } from '../../atoms/Button';
import type { CreatePostInput } from '../../../types/post';

type PostComposerProps = {
  onSubmit: (payload: CreatePostInput) => Promise<void> | void;
};

const initialForm = {
  title: '',
  content: '',
  author: '',
  tags: '',
};

export function PostComposer({ onSubmit }: PostComposerProps) {
  const [form, setForm] = useState(initialForm);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: CreatePostInput = {
      title: form.title.trim(),
      content: form.content.trim(),
      author: form.author.trim(),
      tags: form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    await onSubmit(payload);
    setForm(initialForm);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
        Publicar atualização
      </h2>

      <div className="mt-4 space-y-4">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Título
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0 focus:border-violet-500 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
            placeholder="Ex: Melhoria na arquitetura"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Conteúdo
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows={4}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-violet-500 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
            placeholder="Compartilhe o que você está aprendendo..."
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Autor
            <input
              name="author"
              value={form.author}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-violet-500 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
              placeholder="Seu nome"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Tags
            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-violet-500 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
              placeholder="react, backend, api"
            />
          </label>
        </div>
      </div>

      <div className="mt-5 flex justify-end">
        <Button type="submit">Publicar</Button>
      </div>
    </form>
  );
}
