// lib/api/articles.ts
import { Article, CreateArticlePayload } from "@/types/articles";
import apiClient from "../apiClient";
import { Response } from "@/types/response";

interface GetArticlesOptions {
  page?: number;
  pageSize?: number;
  titleEq?: string;
  categoryNameEq?: string;
}

export const apiGetArticles = async (options: GetArticlesOptions = {}): Promise<Response<Article[]>> => {
  const { page = 1, pageSize = 10, titleEq, categoryNameEq } = options;

  const response = await apiClient<Response<Article[]>>({
    method: "GET",
    url: "/articles",
    params: {
      populate: "*",
      "pagination[page]": page,
      "pagination[pageSize]": pageSize,
      ...(titleEq && { "filters[title][$containsi]": titleEq }),
      ...(categoryNameEq && { "filters[category][name][$eq]": categoryNameEq }),
    },
  });
  return response.data;
};

export const apiAddArticle = async (data: CreateArticlePayload): Promise<Response<CreateArticlePayload>> => {
  return apiClient.post("/articles", { data }).then((res) => res.data);
};

export const apiUpdateArticle = async (id: string, data: CreateArticlePayload): Promise<Response<CreateArticlePayload>> => {
  return apiClient.put(`/articles/${id}`, data).then((res) => res.data);
};

export const apiDeleteArticle = (documentId: string) => {
  return apiClient({
    method: "DELETE",
    url: `/articles/${documentId}`,
  });
};
