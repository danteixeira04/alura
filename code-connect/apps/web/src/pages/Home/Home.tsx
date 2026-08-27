import { useEffect, useState } from 'react';
import { PostCard } from '../../components/molecules/PostCard';
import { AuthPanel } from '../../components/organisms/AuthPanel';
import { PostComposer } from '../../components/organisms/PostComposer';
import { HomeTemplate } from '../../components/templates/HomeTemplate';
import { login, register } from '../../services/auth';
import { createPost, deletePost, fetchPosts, updatePost } from '../../services/posts';
import type { CreatePostInput, Post } from '../../types/post';

const storageKey = 'code-connect-token';

export function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    return window.localStorage.getItem(storageKey);
  });
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authForm, setAuthForm] = useState({
    name: '',
    email: 'demo@codeconnect.com',
    password: 'demo123',
  });
  const [userName, setUserName] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleTagChange = (value: string) => {
    setTagFilter(value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setTagFilter('');
    setPage(1);
  };

  const loadPosts = async (nextPage = page, nextSearch = search, nextTag = tagFilter) => {
    try {
      const result = await fetchPosts({
        page: nextPage,
        limit,
        search: nextSearch,
        tag: nextTag,
      });

      const payload = Array.isArray(result)
        ? { items: result, total: result.length, page: 1, limit, totalPages: 1 }
        : result;

      setPosts(payload.items);
      setTotalPages(payload.totalPages);
      setTotalPosts(payload.total);
      setError(null);
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : 'Não foi possível carregar as publicações.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    void loadPosts();
  }, [page, search, tagFilter, token]);

  const handleAuthChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;
    setAuthForm((current) => ({ ...current, [name]: value }));
  };

  const handleAuthSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const result =
        authMode === 'login'
          ? await login(authForm.email, authForm.password)
          : await register(authForm.name, authForm.email, authForm.password);

      setToken(result.access_token);
      setUserName(result.user.name);
      window.localStorage.setItem(storageKey, result.access_token);
      setError(null);
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : 'Não foi possível autenticar o usuário.';
      setError(message);
    }
  };

  const logout = () => {
    setToken(null);
    setUserName(null);
    window.localStorage.removeItem(storageKey);
  };

  const handleSubmit = async (payload: CreatePostInput) => {
    if (!token) {
      setError('Faça login antes de criar uma publicação.');
      return;
    }

    try {
      const nextPost = await createPost(payload, token);
      setPosts((current) => [nextPost, ...current]);
      setError(null);
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : 'Não foi possível publicar a atualização.';
      setError(message);
    }
  };

  const handleSave = async (id: string, payload: Partial<CreatePostInput>) => {
    if (!token) {
      setError('Faça login antes de editar uma publicação.');
      return;
    }

    try {
      const nextPost = await updatePost(id, payload, token);
      setPosts((current) =>
        current.map((post) => (post.id === id ? nextPost : post)),
      );
      setError(null);
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : 'Não foi possível atualizar a publicação.';
      setError(message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) {
      setError('Faça login antes de remover uma publicação.');
      return;
    }

    try {
      await deletePost(id, token);
      setPosts((current) => current.filter((post) => post.id !== id));
      setError(null);
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : 'Não foi possível remover a publicação.';
      setError(message);
    }
  };

  if (!token) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#021417] text-white">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[-6rem] top-1/2 h-[24rem] w-[24rem] -translate-y-1/2 rounded-full border border-[#1d4147] opacity-60" />
          <div className="absolute right-[-6rem] top-1/2 h-[24rem] w-[24rem] -translate-y-1/2 rounded-full border border-[#1d4147] opacity-60" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(120,255,170,0.08),transparent_55%)]" />
        </div>

        <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center p-4 sm:p-8">
          <AuthPanel
            authMode={authMode}
            authForm={authForm}
            error={error}
            onFieldChange={handleAuthChange}
            onModeChange={setAuthMode}
            onSubmit={handleAuthSubmit}
          />
        </div>
      </div>
    );
  }

  return (
    <HomeTemplate
      header={
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
            comunidade de tecnologia
          </p>
          <h1 className="mt-3 text-3xl font-bold text-gray-900 dark:text-gray-100">
            Code Connect
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Compartilhe aprendizados, desafios e ideias de desenvolvimento.
          </p>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          {token ? (
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Conectado como
                </p>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">
                  {userName ?? 'Usuário' }
                </p>
              </div>
              <button
                type="button"
                onClick={logout}
                className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
              >
                Sair
              </button>
            </div>
          ) : (
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`rounded-md px-3 py-2 text-sm font-medium ${authMode === 'login' ? 'bg-violet-600 text-white' : 'bg-slate-200 text-slate-700'}`}
                >
                  Entrar
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className={`rounded-md px-3 py-2 text-sm font-medium ${authMode === 'register' ? 'bg-violet-600 text-white' : 'bg-slate-200 text-slate-700'}`}
                >
                  Registrar
                </button>
              </div>

              {authMode === 'register' && (
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Nome
                  <input
                    name="name"
                    value={authForm.name}
                    onChange={handleAuthChange}
                    className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-violet-500 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
                    placeholder="Seu nome"
                  />
                </label>
              )}

              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                E-mail
                <input
                  name="email"
                  type="email"
                  value={authForm.email}
                  onChange={handleAuthChange}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-violet-500 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
                  placeholder="seu@email.com"
                />
              </label>

              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Senha
                <input
                  name="password"
                  type="password"
                  value={authForm.password}
                  onChange={handleAuthChange}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-violet-500 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
                  placeholder="Digite sua senha"
                />
              </label>

              <button
                type="submit"
                className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
              >
                {authMode === 'login' ? 'Entrar' : 'Criar conta'}
              </button>
            </form>
          )}
        </div>

        {!token && (
          <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Faça login para criar, editar ou excluir publicações.
          </p>
        )}

        {error && (
          <p
            role="alert"
            className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="flex flex-col gap-3 md:flex-row md:items-end">
            <label className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-200">
              Buscar publicações
              <input
                aria-label="Buscar publicações"
                value={search}
                onChange={(event) => handleSearchChange(event.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-violet-500 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
                placeholder="Digite uma palavra-chave"
              />
            </label>

            <label className="w-full md:w-52 text-sm font-medium text-slate-700 dark:text-slate-200">
              Tag
              <select
                aria-label="Filtrar por tag"
                value={tagFilter}
                onChange={(event) => handleTagChange(event.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-violet-500 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
              >
                <option value="">Todas</option>
                <option value="react">React</option>
                <option value="nestjs">NestJS</option>
                <option value="api">API</option>
                <option value="backend">Backend</option>
                <option value="rest">REST</option>
              </select>
            </label>
          </div>

          <div
            aria-live="polite"
            className="mt-3 flex items-center justify-between gap-3 text-sm text-slate-600 dark:text-slate-300"
          >
            <span>
              {posts.length} de {totalPosts} publicação(ões) exibidas
            </span>
            <button
              type="button"
              aria-label="Limpar filtros"
              onClick={clearFilters}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Limpar filtros
            </button>
          </div>
        </div>

        <PostComposer onSubmit={handleSubmit} />

        {isLoading ? (
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Carregando publicações...
          </p>
        ) : posts.length === 0 ? (
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Nenhuma publicação foi encontrada.
          </p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onDelete={handleDelete}
                onSave={handleSave}
              />
            ))}

            {totalPages > 1 && (
              <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <button
                  type="button"
                  aria-label="Página anterior"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page === 1}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-slate-200"
                >
                  Anterior
                </button>

                <p className="text-sm text-slate-600 dark:text-slate-300" aria-live="polite">
                  Página {page} de {totalPages}
                </p>

                <button
                  type="button"
                  aria-label="Próxima página"
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                  disabled={page === totalPages}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-slate-200"
                >
                  Próxima
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </HomeTemplate>
  );
}

export default Home;