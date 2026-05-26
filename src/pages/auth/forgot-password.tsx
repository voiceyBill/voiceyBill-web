import Logo from "@/components/logo/logo";
import ForgotPasswordForm from "./_component/forgot-password-form";
import AuthRightPanel from "./_component/auth-right-panel";

const ForgotPassword = () => {
  return (
    <div className="min-h-svh grid lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-start">
          <Logo url="/" />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <ForgotPasswordForm />
          </div>
        </div>
      </div>

      <AuthRightPanel
        badge="Account Recovery"
        title="Get back in quickly."
        subtitle="We'll send a one-time code to your email. Verify it to create a new password and restore full access."
      />
    </div>
  );
};

export default ForgotPassword;
