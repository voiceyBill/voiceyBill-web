import { apiClient } from "@/app/api-client";
import {
  CategoryResponse,
  CreateCategoryRequest,
  GetCategoriesResponse,
  UpdateCategoryRequest,
} from "./categoryType";

export const categoryApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<GetCategoriesResponse, void>({
      query: () => "/category",
      providesTags: ["categories"],
    }),
    createCategory: builder.mutation<CategoryResponse, CreateCategoryRequest>({
      query: (body) => ({ url: "/category", method: "POST", body }),
      invalidatesTags: ["categories"],
    }),
    updateCategory: builder.mutation<CategoryResponse, UpdateCategoryRequest>({
      query: ({ id, body }) => ({ url: `/category/${id}`, method: "PUT", body }),
      invalidatesTags: ["categories"],
    }),
    deleteCategory: builder.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/category/${id}`, method: "DELETE" }),
      invalidatesTags: ["categories"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
