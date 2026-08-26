export type Post = {
  id: string;
  title: string;
  content: string;
  author: string;
  tags: string[];
  createdAt: string;
};

export type CreatePostInput = {
  title: string;
  content: string;
  author: string;
  tags: string[];
};
