import SetNewPasswordForm from "./_component/set-new-password-form";
import Logo from "@/components/logo/logo";
import { CheckCircle } from "lucide-react";

const SetNewPassword = () => {
  const highlights = [
    "Create a strong password with 6+ characters",
    "Password encryption protects your data",
    "Confirm password to prevent typos",
    "Immediate access after password reset",
  ];

  return (
    <div className="min-h-svh grid lg:grid-cols-2 bg-background text-foreground">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-start">
          <Logo url="/" />
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <SetNewPasswordForm />
          </div>
        </div>
      </div>

      <div className="hidden lg:flex flex-col justify-between bg-card text-card-foreground p-12">
        <div />

        <div className="space-y-8 max-w-md">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
              Security
            </div>

            <h2 className="text-3xl font-bold leading-snug">
              Create a new <span className="text-primary">password</span>
            </h2>

            <p className="text-muted-foreground leading-relaxed">
              Set a strong password to protect your VoiceyBill account and your financial data.
            </p>
          </div>

          <ul className="space-y-3">
            {highlights.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                <span className="text-sm text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-border pt-8">
          <p className="text-xs text-muted-foreground">© 2025 VoiceyBill</p>
        </div>
      </div>
    </div>
  );
};

export default SetNewPassword;
