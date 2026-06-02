import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PasswordInput from "@/components/password-input";
import { Link, createSearchParams, useNavigate } from "react-router-dom";
import { AUTH_ROUTES, PROTECTED_ROUTES } from "@/routes/common/routePath";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { useLoginMutation } from "@/features/auth/authAPI";
import { useAppDispatch } from "@/app/hook";
import { setCredentials } from "@/features/auth/authSlice";
import type { ErrorResponse } from "@/features/auth/authType";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof schema>;

const SignInForm = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (values: FormValues) => {
    login(values)
      .unwrap()
      .then((data) => {
        dispatch(setCredentials(data));
        toast.success("Login successful");
        setTimeout(() => {
          navigate(PROTECTED_ROUTES.OVERVIEW);
        }, 1000);
      })
      .catch((error) => {
        const apiError = error as ErrorResponse;
        if (apiError.data?.errorCode === "AUTH_EMAIL_NOT_VERIFIED") {
          navigate({
            pathname: AUTH_ROUTES.VERIFY_OTP,
            search: createSearchParams({ email: values.email }).toString(),
          });
          toast.error(apiError.data?.message || "Please verify your email first");
          return;
        }
        toast.error(apiError.data?.message || "Failed to login");
      });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        {/* Heading */}
        <div className="mb-2">
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-foreground tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-zinc-500 mt-1.5">
            Sign in to your account to continue
          </p>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-zinc-700">
                  Email
                </FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-sm font-medium text-zinc-700">
                    Password
                  </FormLabel>
                  <Link
                    to={AUTH_ROUTES.FORGOT_PASSWORD}
                    className="text-xs text-[#015200] font-semibold hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <PasswordInput placeholder="Enter your password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Submit */}
        <Button
          disabled={isLoading}
          type="submit"
          className="w-full h-11 bg-[#015200] hover:bg-black text-white font-semibold rounded-xl transition-colors"
        >
          {isLoading && <Loader className="h-4 w-4 animate-spin mr-2" />}
          Sign in
        </Button>

        {/* Footer */}
        <p className="text-center text-sm text-zinc-500">
          Don&apos;t have an account?{" "}
          <Link
            to={AUTH_ROUTES.SIGN_UP}
            className="text-[#015200] font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </form>
    </Form>
  );
};

export default SignInForm;
