import { Link } from "react-router-dom";
import SignUpForm from "./_component/signup-form";

const SignUp = () => {
  return (
    <div className="home-page-wrapper min-h-svh bg-background relative flex items-center justify-center p-4 sm:p-6">
      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(1,82,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(1,82,0,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative w-full max-w-[440px]">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="VoiceyBill"
              className="w-10 h-10 rounded-full object-cover shrink-0"
            />
            <span className="font-display font-bold text-xl tracking-tight text-foreground">
              VoiceyBill
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-card text-card-foreground rounded-3xl border border-border shadow-sm p-8 sm:p-10">
          <SignUpForm />
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          <Link to="/" className="hover:text-foreground transition-colors">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
