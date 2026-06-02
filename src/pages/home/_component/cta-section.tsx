import { Link } from "react-router-dom";
import { useTypedSelector } from "@/app/hook";

const stats = [
  { value: "50+", label: "Languages" },
  { value: "98.2%", label: "OCR Accuracy" },
  { value: "$0", label: "Initial Cost" },
  { value: "300+", label: "Active Users" },
];

const CtaSection = () => {
  const { user, accessToken } = useTypedSelector((state) => state.auth);
  const isAuthenticated = !!(user && accessToken);

  return (
    <section className="py-32 bg-background overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 text-center">

        <h2 className="font-display font-bold text-5xl md:text-7xl mb-8 text-foreground leading-tight">
          Ready to track <br />
          <em className="italic text-muted-foreground">smarter?</em>
        </h2>

        <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
          No credit card required. Sign up in two minutes and log your first expense today.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {isAuthenticated ? (
            <Link
              to="/overview"
              className="w-full sm:w-auto inline-flex items-center justify-center bg-primary text-primary-foreground font-bold text-lg px-12 py-5 rounded-2xl hover:bg-primary/90 transition-all shadow-xl"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/sign-up"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-primary text-primary-foreground font-bold text-lg px-12 py-5 rounded-2xl hover:bg-primary/90 transition-all shadow-xl"
              >
                Create free account
              </Link>
              <Link
                to="/sign-in"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-muted text-foreground font-bold text-lg px-12 py-5 rounded-2xl hover:bg-muted/80 transition-all"
              >
                Sign in
              </Link>
            </>
          )}
        </div>

        <div className="mt-16 pt-16 border-t border-border grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ value, label }) => (
            <div key={label}>
              <div className="font-display font-bold text-2xl text-foreground">{value}</div>
              <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider mt-1">
                {label}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CtaSection;
