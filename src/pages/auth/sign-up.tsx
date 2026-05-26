import SignUpForm from "./_component/signup-form";
import Logo from "@/components/logo/logo";
import AuthRightPanel from "./_component/auth-right-panel";

const SignUp = () => {
  return (
    <div className="min-h-svh grid lg:grid-cols-2">
      {/* Left: form */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-start">
          <Logo url="/" />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <SignUpForm />
          </div>
        </div>
      </div>

      {/* Right: brand panel */}
      <AuthRightPanel
        badge="Join Today"
        title="Your finances, clearly tracked."
        subtitle="Free forever. No credit card. Set up in under two minutes and log your first expense today."
      />
    </div>
  );
};

export default SignUp;
