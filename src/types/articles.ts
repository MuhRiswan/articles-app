// types/articles.ts
export interface Comment {
  id: number;
  documentId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string | null;
}

export interface Category {
  id: number;
  documentId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string | null;
}

export interface Article {
  id: number;
  documentId: string;
  title: string;
  description: string;
  cover_image_url: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string | null;
  category: Category | null;
  comments: Comment[];
  localizations: any[];
  user?: {
    avatar: string;
    username: string;
  };
}

export interface CreateArticlePayload {
  title: string;
  description: string;
  cover_image_url: string;
  category: number;
}

export interface Pagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface ArticlesResponse {
  data: Article[];
  meta?: {
    pagination: Pagination;
  };
  code: number;
  message: string;
  version: string;
}
