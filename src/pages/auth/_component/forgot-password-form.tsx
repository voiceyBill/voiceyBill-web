import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, createSearchParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { Loader, Mail } from "lucide-react";
import { z } from "zod";
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
import { AUTH_ROUTES } from "@/routes/common/routePath";
import { useForgotPasswordMutation } from "@/features/auth/authAPI";

const schema = z.object({
  email: z.string().email("Invalid email address"),
});

type FormValues = z.infer<typeof schema>;

const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (values: FormValues) => {
    forgotPassword(values)
      .unwrap()
      .then(() => {
        toast.success("Reset code sent to your email");
        navigate({
          pathname: AUTH_ROUTES.VERIFY_RESET_OTP,
          search: createSearchParams({ email: values.email }).toString(),
        });
      })
      .catch((error) => {
        toast.error(error.data?.message || "Failed to send reset code");
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Icon + Heading */}
        <div className="mb-2">
          <div className="w-12 h-12 bg-[#F4F4F5] rounded-2xl flex items-center justify-center mb-5">
            <Mail className="w-6 h-6 text-[#015200]" />
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-foreground tracking-tight">
            Forgot password?
          </h1>
          <p className="text-sm text-zinc-500 mt-1.5">
            Enter your email and we'll send a one-time reset code.
          </p>
        </div>

        {/* Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-zinc-700">
                Email address
              </FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <Button
          disabled={isLoading}
          type="submit"
          className="w-full h-11 bg-[#015200] hover:bg-black text-white font-semibold rounded-xl transition-colors"
        >
          {isLoading && <Loader className="h-4 w-4 animate-spin mr-2" />}
          Send reset code
        </Button>

        {/* Footer */}
        <p className="text-center text-sm text-zinc-500">
          Remembered it?{" "}
          <Link
            to={AUTH_ROUTES.SIGN_IN}
            className="text-[#015200] font-semibold hover:underline"
          >
            Back to sign in
          </Link>
        </p>
      </form>
    </Form>
  );
};

export default ForgotPasswordForm;
