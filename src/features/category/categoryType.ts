export interface Category {
  _id: string;
  userId: string;
  name: string;
  color: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetCategoriesResponse {
  message: string;
  data: Category[];
}

export interface CreateCategoryRequest {
  name: string;
  color: string;
}

export interface UpdateCategoryRequest {
  id: string;
  body: Partial<CreateCategoryRequest>;
}

export interface CategoryResponse {
  message: string;
  data: Category;
}
