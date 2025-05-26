import { Response } from "@/types/response";
import apiClient from "../apiClient";
import { CategoryResponse } from "@/types/categories";

export const apiGetCategories = async (): Promise<Response<CategoryResponse[]>> => {
  const response = await apiClient<Response<CategoryResponse[]>>({
    method: "GET",
    url: "/categories",
  });
  return response.data;
};
