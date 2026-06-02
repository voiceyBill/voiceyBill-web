import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, RefreshCcw, ShieldCheck } from "lucide-react";
import { useNavigate, useSearchParams, createSearchParams, Link } from "react-router-dom";
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
import { useForgotPasswordMutation } from "@/features/auth/authAPI";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().regex(/^\d{6}$/, "Enter the 6-digit code sent to your email"),
});

type FormValues = z.infer<typeof schema>;

const VerifyResetOtpForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailFromQuery = searchParams.get("email") ?? "";
  const [otpValue, setOtpValue] = useState("");
  const [forgotPassword, { isLoading: isResending }] = useForgotPasswordMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: emailFromQuery, otp: "" },
  });

  const onSubmit = (values: FormValues) => {
    navigate({
      pathname: AUTH_ROUTES.SET_NEW_PASSWORD,
      search: createSearchParams({ email: values.email, otp: values.otp }).toString(),
    });
  };

  const handleResend = () => {
    const email = form.getValues("email");
    if (!email) {
      toast.error("Enter your email first");
      return;
    }
    forgotPassword({ email })
      .unwrap()
      .then(() => toast.success("Reset code resent to your email"))
      .catch((error) => toast.error(error.data?.message || "Failed to resend code"));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">

        {/* Icon + Heading */}
        <div className="mb-2">
          <div className="w-12 h-12 bg-[#F4F4F5] rounded-2xl flex items-center justify-center mb-5">
            <ShieldCheck className="w-6 h-6 text-[#015200]" />
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-foreground tracking-tight">
            Check your email
          </h1>
          <p className="text-sm text-zinc-500 mt-1.5">
            We sent a 6-digit reset code to{" "}
            {emailFromQuery ? (
              <span className="font-semibold text-zinc-700">{emailFromQuery}</span>
            ) : (
              "your email"
            )}
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
                  <Input placeholder="you@example.com" disabled {...field} />
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
                <FormLabel className="text-sm font-medium text-zinc-700">
                  Reset code
                </FormLabel>
                <FormControl>
                  <OtpInput
                    value={otpValue}
                    onChange={(value) => {
                      setOtpValue(value);
                      form.setValue("otp", value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Primary CTA */}
        <Button
          disabled={otpValue.length !== 6}
          type="submit"
          className="w-full h-11 bg-[#015200] hover:bg-black text-white font-semibold rounded-xl transition-colors"
        >
          Continue
        </Button>

        {/* Resend */}
        <Button
          type="button"
          variant="outline"
          disabled={isResending}
          onClick={handleResend}
          className="w-full h-11 rounded-xl font-semibold border-zinc-200 text-zinc-700 hover:bg-zinc-50 transition-colors"
        >
          {isResending ? (
            <Loader className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <RefreshCcw className="h-4 w-4 mr-2" />
          )}
          Resend code
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

export default VerifyResetOtpForm;
