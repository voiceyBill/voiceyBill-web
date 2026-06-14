import { useState } from "react";
import { Loader, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
} from "@/features/category/categoryAPI";
import type { Category } from "@/features/category/categoryType";
import CategoryForm from "./_components/category-form";

const Categories = () => {
  const { data, isLoading } = useGetCategoriesQuery();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const categories = data?.data ?? [];

  const handleDelete = (category: Category) => {
    if (!confirm(`Delete "${category.name}"? Existing transactions will move to "Uncategorized".`)) return;

    deleteCategory(category._id)
      .unwrap()
      .then(() => toast.success("Category deleted"))
      .catch((err) => toast.error(err?.data?.message || "Failed to delete category"));
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
  };

  const handleDone = () => {
    setEditingCategory(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Categories</h3>
        <p className="text-sm text-muted-foreground">
          Manage your transaction categories. To add a new category, use the transaction form.
        </p>
      </div>

      {editingCategory && (
        <CategoryForm category={editingCategory} onDone={handleDone} />
      )}

      <div className="space-y-2">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="flex items-center justify-between rounded-lg border px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              <span className="text-sm font-medium">{cat.name}</span>
              {cat.isDefault && (
                <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  default
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => handleEdit(cat)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => handleDelete(cat)}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
