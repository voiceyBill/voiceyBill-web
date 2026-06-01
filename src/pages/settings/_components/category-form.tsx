import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "@/features/category/categoryAPI";
import type { Category } from "@/features/category/categoryType";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(50, "Name too long"),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
});

type FormValues = z.infer<typeof schema>;

const PRESET_COLORS = [
  "#EF4444", "#F97316", "#F59E0B", "#22C55E",
  "#10B981", "#06B6D4", "#3B82F6", "#6366F1",
  "#8B5CF6", "#EC4899", "#6B7280", "#0EA5E9",
];

interface Props {
  category?: Category;
  onDone: () => void;
}

const CategoryForm = ({ category, onDone }: Props) => {
  const isEdit = !!category;

  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: category?.name ?? "",
      color: category?.color ?? "#6B7280",
    },
  });

  const onSubmit = (values: FormValues) => {
    const action = isEdit
      ? updateCategory({ id: category._id, body: values })
      : createCategory(values);

    action
      .unwrap()
      .then(() => {
        toast.success(`Category ${isEdit ? "updated" : "created"} successfully`);
        onDone();
      })
      .catch((err) => {
        toast.error(err?.data?.message || `Failed to ${isEdit ? "update" : "create"} category`);
      });
  };

  const isLoading = isCreating || isUpdating;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Freelance Income" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => field.onChange(color)}
                        className="w-7 h-7 rounded-full border-2 transition-all"
                        style={{
                          backgroundColor: color,
                          borderColor: field.value === color ? "#000" : "transparent",
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border"
                    />
                    <Input
                      {...field}
                      placeholder="#6B7280"
                      className="w-32 font-mono text-sm"
                    />
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 pt-2">
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading && <Loader className="h-4 w-4 animate-spin mr-2" />}
            {isEdit ? "Update" : "Create"}
          </Button>
          <Button type="button" variant="outline" onClick={onDone}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CategoryForm;
