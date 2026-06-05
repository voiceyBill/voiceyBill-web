import { useState, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getFlagUrl } from "@/lib/currency-flag";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SingleSelector } from "@/components/ui/single-select";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppDispatch, useTypedSelector } from "@/app/hook";
import { Loader } from "lucide-react";
import { useUpdateUserMutation } from "@/features/user/userAPI";
import { updateCredentials } from "@/features/auth/authSlice";
import { useGetSupportedCurrenciesQuery } from "@/features/currency/currencyAPI";
import { ALL_CURRENCIES } from "@/constants/currencies";

const accountFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .optional(),
  profilePicture: z.string(),
  baseCurrency: z.string().optional(),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

export function AccountForm() {
  const dispatch = useAppDispatch();
  const { user } = useTypedSelector((state) => state.auth);

  const [file, setFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [updateUserMutation, { isLoading }] = useUpdateUserMutation();
  const { data: currencyData } = useGetSupportedCurrenciesQuery();
  const currencyOptions = useMemo(() => {
    const list =
      currencyData?.currencies && currencyData.currencies.length > 0
        ? currencyData.currencies
        : ALL_CURRENCIES;

    return list.map((currency) => {
      const displaySymbol = currency.symbol.replace(/₨/g, "Rs");
      const flagUrl = getFlagUrl(currency.code);
      return {
        value: currency.code,
        label: `${displaySymbol} ${currency.code} - ${currency.name}`,
        flagUrl: flagUrl || "",
      };
    });
  }, [currencyData]);
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: user?.name || "",
      profilePicture: user?.profilePicture || "",
      baseCurrency: user?.baseCurrency || "USD",
    },
  });

  // Check if there are any changes
  const hasChanges =
    form.watch("name") !== user?.name ||
    form.watch("baseCurrency") !== (user?.baseCurrency || "USD") ||
    file !== null;

  const onSubmit = (values: AccountFormValues) => {
    if (isLoading) return;

    // Prevent submission if no changes
    if (!hasChanges) {
      toast.info("No changes to update");
      return;
    }

    const formData = new FormData();
    formData.append("name", values.name || "");
    if (values.baseCurrency)
      formData.append("baseCurrency", values.baseCurrency);
    if (file) formData.append("profilePicture", file);

    updateUserMutation(formData)
      .unwrap()
      .then((response) => {
        dispatch(
          updateCredentials({
            user: {
              profilePicture: response.data.profilePicture,
              name: response.data.name,
              baseCurrency: response.data.baseCurrency,
            },
          }),
        );
        toast.success("Account updated successfully");
        setFile(null);
        setAvatarUrl(null);
      })
      .catch((error) => {
        toast.error(error.data.message || "Failed to update account");
      });
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast.error("Please select a file");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    setFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setAvatarUrl(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col items-start space-y-4">
          <FormLabel>Profile Picture</FormLabel>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={avatarUrl || user?.profilePicture || ""}
                className="!object-cover !object-center"
              />
              <AvatarFallback className="text-2xl">
                {form.watch("name")?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="max-w-[250px]"
              />
              <p className="text-xs text-muted-foreground">
                Recommended: Square JPG, PNG, at least 300x300px.
              </p>
            </div>
          </div>
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="baseCurrency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Base Currency</FormLabel>
              <SingleSelector
                value={currencyOptions.find((opt) => opt.value === field.value)}
                onChange={(option) => field.onChange(option?.value || "")}
                options={currencyOptions}
                placeholder="Select currency"
              />
              <p className="text-xs text-muted-foreground">
                All transactions will be converted to this currency.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isLoading || !hasChanges} type="submit">
          {isLoading && <Loader className="h-4 w-4 animate-spin" />}
          Update account
        </Button>
      </form>
    </Form>
  );
}
