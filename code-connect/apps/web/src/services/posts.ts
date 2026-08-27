import type { CreatePostInput, Post } from '../types/post';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export type PostListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  tag?: string;
};

export type PostListResponse = {
  items: Post[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

async function parseResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message =
      payload?.message ?? payload?.error ?? 'Unable to complete the request';
    throw new Error(message);
  }

  return payload as T;
}

function getHeaders(token?: string) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export async function fetchPosts(
  query: PostListQuery = {},
): Promise<Post[] | PostListResponse> {
  const searchParams = new URLSearchParams();

  if (query.page) searchParams.set('page', String(query.page));
  if (query.limit) searchParams.set('limit', String(query.limit));
  if (query.search) searchParams.set('search', query.search);
  if (query.tag) searchParams.set('tag', query.tag);

  const response = await fetch(
    `${API_URL}/posts${searchParams.size > 0 ? `?${searchParams.toString()}` : ''}`,
  );

  return parseResponse<Post[] | PostListResponse>(response);
}

export async function createPost(
  payload: CreatePostInput,
  token?: string,
): Promise<Post> {
  const response = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(payload),
  });

  return parseResponse<Post>(response);
}

export async function updatePost(
  id: string,
  payload: Partial<CreatePostInput>,
  token?: string,
): Promise<Post> {
  const response = await fetch(`${API_URL}/posts/${id}`, {
    method: 'PATCH',
    headers: getHeaders(token),
    body: JSON.stringify(payload),
  });

  return parseResponse<Post>(response);
}

export async function deletePost(id: string, token?: string): Promise<void> {
  const response = await fetch(`${API_URL}/posts/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });

  await parseResponse<{ deleted: boolean }>(response);
}
