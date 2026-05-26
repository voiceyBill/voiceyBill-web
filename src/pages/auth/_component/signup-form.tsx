import { useState } from "react";
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
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[A-Z]/, "Must contain uppercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[^A-Za-z0-9]/, "Must contain special character"),
});

type FormValues = z.infer<typeof schema>;

const SignUpForm = () => {
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const [shakeCount, setShakeCount] = useState(0);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const passwordValue = form.watch("password") ?? ""
  const rules = {
    length:passwordValue.length >= 8,
    uppercase:/[A-Z]/.test(passwordValue),
    number: /[0-9]/.test(passwordValue),
    special: /[^A-Za-z0-9]/.test(passwordValue),
    lowercase: /[a-z]/.test(passwordValue),
  }

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
              "An account with this email already exists. Please sign in instead."
          );
          return;
        }

        if (apiError.data?.errorCode === "VALIDATION_ERROR" && apiError.data?.errors) {
          apiError.data.errors.forEach((err) => {
            if (err.field === "password" || err.field === "email" || err.field === "name") {
              form.setError(err.field as keyof FormValues, {
                type: "server",
                message: err.message,
              });
            }
          });
          toast.error("Please fix the validation errors.");
          return;
        }

        toast.error(apiError.data?.message || "Failed to sign up");
      });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, () => {
          setShakeCount((prev) => prev + 1);
        })}
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Sign up to VoiceyBill</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Fill information below to sign up
          </p>
        </div>
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Your email address" {...field} />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="Min. 8 characters" {...field} />
                </FormControl>
                <div className="mt-3 p-3 bg-muted/20 border border-border/40 rounded-lg space-y-2">
                  {[
                    { label: "At least 8 characters", valid: rules.length },
                    { label: "One lowercase letter", valid: rules.lowercase },
                    { label: "One uppercase letter", valid: rules.uppercase },
                    { label: "One number", valid: rules.number },
                    { label: "One special character", valid: rules.special },
                  ].map((rule) => {
                    const isUnmetAndSubmitted = !rule.valid && shakeCount > 0;
                    return (
                      <div
                        key={`${rule.label}-${rule.valid}-${shakeCount}`}
                        className={`flex items-center gap-2 text-xs transition-all duration-300 ${
                          rule.valid
                            ? "text-emerald-600 dark:text-emerald-400 font-medium translate-x-1"
                            : isUnmetAndSubmitted
                            ? "text-destructive animate-shake font-medium"
                            : "text-muted-foreground"
                        }`}
                      >
                        {rule.valid ? (
                          <Check className="h-3.5 w-3.5 text-emerald-500 stroke-[3.5px] scale-110 transition-transform duration-300" />
                        ) : (
                          <Circle className={`h-3.5 w-3.5 stroke-[2px] transition-colors duration-300 ${
                            isUnmetAndSubmitted ? "text-destructive/80" : "text-muted-foreground/60"
                          }`} />
                        )}
                        <span>{rule.label}</span>
                      </div>
                    );
                  })}
                </div>
                
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isLoading} type="submit" className="w-full">
            {isLoading && <Loader className="h-4 w-4 animate-spin" />}
            Sign up
          </Button>
        </div>
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link
            to={AUTH_ROUTES.SIGN_IN}
            className="underline underline-offset-4"
          >
            Sign in
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default SignUpForm;
