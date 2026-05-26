import Logo from "@/components/logo/logo";
import ResetPasswordForm from "./_component/reset-password-form";
import AuthRightPanel from "./_component/auth-right-panel";

const ResetPassword = () => {
  return (
    <div className="min-h-svh grid lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-start">
          <Logo url="/" />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <ResetPasswordForm />
          </div>
        </div>
      </div>

      <AuthRightPanel
        badge="Reset Password"
        title="Almost there."
        subtitle="Enter the reset code from your inbox, then set a new password to restore full access to your account."
      />
    </div>
  );
};

export default ResetPassword;
