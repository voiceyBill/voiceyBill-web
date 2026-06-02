import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, RefreshCcw } from "lucide-react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import OtpInput from "@/components/otp-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AUTH_ROUTES } from "@/routes/common/routePath";
import {
  useResendOtpMutation,
  useVerifyOtpMutation,
} from "@/features/auth/authAPI";

import { useAppDispatch } from "@/app/hook";
import { setCredentials } from "@/features/auth/authSlice";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import type { ErrorResponse } from "@/features/auth/authType";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().regex(/^\d{6}$/, "Enter the 6-digit code sent to your email"),
});

type FormValues = z.infer<typeof schema>;

const VerifyOtpForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailFromQuery = searchParams.get("email") ?? "";
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();
  const [otpValue, setOtpValue] = useState("");
  const dispatch = useAppDispatch();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: emailFromQuery,
      otp: "",
    },
  });

  useEffect(() => {
    if (emailFromQuery) {
      form.setValue("email", emailFromQuery);
    }
  }, [emailFromQuery, form]);

  const onSubmit = (values: FormValues) => {
    verifyOtp(values)
      .unwrap()
      .then((data) => {
        toast.success("Email verified successfully!");
        // Auto-login: Store credentials and redirect to dashboard
        dispatch(setCredentials(data));
        setTimeout(() => {
          navigate(PROTECTED_ROUTES.OVERVIEW);
        }, 1000);
      })
      .catch((error) => {
        const apiError = error as ErrorResponse;
        toast.error(apiError.data?.message || "Failed to verify code");
      });
  };

  const handleResend = () => {
    const email = form.getValues("email");
    if (!email) {
      toast.error("Enter your email first");
      return;
    }

    resendOtp({ email })
      .unwrap()
      .then((data) => {
        toast.success(data.message || "Verification code resent");
      })
      .catch((error) => {
        toast.error(error.data?.message || "Failed to resend code");
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-foreground tracking-tight">Verify your email</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter the 6-digit code sent to your inbox to activate your account.
          </p>
        </div>

        <div className="grid gap-6">
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
            name="otp"
            render={() => (
              <FormItem>
                <FormLabel>Verification code</FormLabel>
                <FormControl>
                  <OtpInput
                    value={otpValue}
                    onChange={(value) => {
                      setOtpValue(value);
                      form.setValue("otp", value);
                    }}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={isLoading} type="submit" className="w-full">
            {isLoading && <Loader className="h-4 w-4 animate-spin" />}
            Verify email
          </Button>

          <Button
            type="button"
            variant="outline"
            disabled={isResending}
            onClick={handleResend}
            className="w-full"
          >
            {isResending ? <Loader className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
            Resend code
          </Button>
        </div>

        <div className="text-center text-sm">
          Already verified?{" "}
          <Link to={AUTH_ROUTES.SIGN_IN} className="underline underline-offset-4">
            Sign in
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default VerifyOtpForm;
