import SignInForm from "./_component/signin-form";
import Logo from "@/components/logo/logo";
import AuthRightPanel from "./_component/auth-right-panel";

const SignIn = () => {
  return (
    <div className="min-h-svh grid lg:grid-cols-2">
      {/* Left: form */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-start">
          <Logo url="/" />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <SignInForm />
          </div>
        </div>
      </div>

      {/* Right: brand panel */}
      <AuthRightPanel
        badge="Personal Finance"
        title="Track every expense, effortlessly."
        subtitle="Say it, snap it, or type it — VoiceyBill logs and categorizes every transaction in any language, any currency."
      />
    </div>
  );
};

export default SignIn;
