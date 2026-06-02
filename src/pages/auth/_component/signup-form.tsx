import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader, Check, Circle } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PasswordInput from "@/components/password-input";
import { Link, createSearchParams, useNavigate } from "react-router-dom";
import { AUTH_ROUTES } from "@/routes/common/routePath";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRegisterMutation } from "@/features/auth/authAPI";
import type { ErrorResponse } from "@/features/auth/authType";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain uppercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[^A-Za-z0-9]/, "Must contain special character"),
});

type FormValues = z.infer<typeof schema>;

const SignUpForm = () => {
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const passwordValue = form.watch("password") ?? "";
  const rules = [
    { label: "At least 8 characters", valid: passwordValue.length >= 8 },
    { label: "One uppercase letter", valid: /[A-Z]/.test(passwordValue) },
    { label: "One lowercase letter", valid: /[a-z]/.test(passwordValue) },
    { label: "One number", valid: /[0-9]/.test(passwordValue) },
    { label: "One special character", valid: /[^A-Za-z0-9]/.test(passwordValue) },
  ];

  const onSubmit = (values: FormValues) => {
    register(values)
      .unwrap()
      .then(() => {
        form.reset();
        toast.success("Verification code sent to your email");
        navigate({
          pathname: AUTH_ROUTES.VERIFY_OTP,
          search: createSearchParams({ email: values.email }).toString(),
        });
      })
      .catch((error) => {
        const apiError = error as ErrorResponse;
        if (apiError.data?.errorCode === "AUTH_EMAIL_ALREADY_EXISTS") {
          toast.error(
            apiError.data?.message ||
              "An account with this email already exists."
          );
          return;
        }
        toast.error(apiError.data?.message || "Failed to sign up");
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Heading */}
        <div className="mb-2">
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-foreground tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-zinc-500 mt-1.5">
            Free forever. Set up in under two minutes.
          </p>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-zinc-700">
                  Full name
                </FormLabel>
                <FormControl>
                  <Input placeholder="Your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                <FormLabel className="text-sm font-medium text-zinc-700">
                  Password
                </FormLabel>
                <FormControl>
                  <PasswordInput placeholder="Min. 8 characters" {...field} />
                </FormControl>

                {/* Password rules */}
                {passwordValue.length > 0 && (
                  <div className="mt-2.5 grid grid-cols-1 gap-1.5">
                    {rules.map((rule) => (
                      <div
                        key={rule.label}
                        className={`flex items-center gap-2 text-xs transition-colors ${
                          rule.valid ? "text-[#015200]" : "text-zinc-400"
                        }`}
                      >
                        {rule.valid ? (
                          <Check className="h-3 w-3 shrink-0" />
                        ) : (
                          <Circle className="h-3 w-3 shrink-0" />
                        )}
                        <span>{rule.label}</span>
                      </div>
                    ))}
                  </div>
                )}

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
          Create account
        </Button>

        {/* Footer */}
        <p className="text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link
            to={AUTH_ROUTES.SIGN_IN}
            className="text-[#015200] font-semibold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </Form>
  );
};

export default SignUpForm;
