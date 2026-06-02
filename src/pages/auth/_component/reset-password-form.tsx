import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, KeyRound, Check, Circle } from "lucide-react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PasswordInput from "@/components/password-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AUTH_ROUTES } from "@/routes/common/routePath";
import { useResetPasswordMutation } from "@/features/auth/authAPI";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().regex(/^\d{6}$/, "Enter the 6-digit reset code"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain uppercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[^A-Za-z0-9]/, "Must contain special character"),
});

type FormValues = z.infer<typeof schema>;

const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailFromQuery = searchParams.get("email") ?? "";
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: emailFromQuery, otp: "", password: "" },
  });

  useEffect(() => {
    if (emailFromQuery) form.setValue("email", emailFromQuery);
  }, [emailFromQuery, form]);

  const passwordValue = form.watch("password") ?? "";
  const rules = [
    { label: "At least 8 characters", valid: passwordValue.length >= 8 },
    { label: "One uppercase letter", valid: /[A-Z]/.test(passwordValue) },
    { label: "One lowercase letter", valid: /[a-z]/.test(passwordValue) },
    { label: "One number", valid: /[0-9]/.test(passwordValue) },
    { label: "One special character", valid: /[^A-Za-z0-9]/.test(passwordValue) },
  ];

  const onSubmit = (values: FormValues) => {
    resetPassword(values)
      .unwrap()
      .then((data) => {
        toast.success(data.message || "Password reset successfully");
        navigate(AUTH_ROUTES.SIGN_IN);
      })
      .catch((error) => {
        toast.error(error.data?.message || "Failed to reset password");
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Icon + Heading */}
        <div className="mb-2">
          <div className="w-12 h-12 bg-[#F4F4F5] rounded-2xl flex items-center justify-center mb-5">
            <KeyRound className="w-6 h-6 text-[#015200]" />
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-foreground tracking-tight">
            Reset password
          </h1>
          <p className="text-sm text-zinc-500 mt-1.5">
            Enter the code from your email and choose a new password.
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
                  Email address
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
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-zinc-700">
                  Reset code
                </FormLabel>
                <FormControl>
                  <Input
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="6-digit code"
                    className="tracking-[0.3em] text-center font-mono"
                    {...field}
                  />
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
                  New password
                </FormLabel>
                <FormControl>
                  <PasswordInput placeholder="Min. 8 characters" {...field} />
                </FormControl>

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
          Set new password
        </Button>

        {/* Footer */}
        <p className="text-center text-sm text-zinc-500">
          Back to{" "}
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

export default ResetPasswordForm;
