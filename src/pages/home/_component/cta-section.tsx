import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTypedSelector } from "@/app/hook";

const CtaSection = () => {
  const { user, accessToken } = useTypedSelector((state) => state.auth);
  const isAuthenticated = !!(user && accessToken);

  return (
    <section className="py-28 border-t border-border bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="rounded-3xl overflow-hidden bg-[var(--secondary-dark-color)] px-8 py-20 sm:px-16 text-center relative">

          {/* Subtle grid texture */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(var(--brand-green-light) 1px, transparent 1px), linear-gradient(90deg, var(--brand-green-light) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative space-y-7 max-w-xl mx-auto">

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--brand-green-light)]/70">
              &gt; Get started
            </p>

            <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
              Start tracking in two minutes.
            </h2>

            <p className="text-white/50 leading-relaxed text-lg">
              No credit card. No setup fee. Sign up and log your first expense today.
            </p>

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              {isAuthenticated ? (
                <Button
                  size="lg"
                  asChild
                  className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6 rounded-md text-sm font-semibold"
                >
                  <Link to="/overview">Go to Dashboard →</Link>
                </Button>
              ) : (
                <>
                  <Button
                    size="lg"
                    asChild
                    className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6 rounded-md text-sm font-semibold"
                  >
                    <Link to="/sign-up">Create free account →</Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="h-11 px-6 rounded-md text-sm font-semibold border-white/20 text-white hover:bg-white/10 hover:text-white bg-transparent"
                  >
                    <Link to="/sign-in">Sign in</Link>
                  </Button>
                </>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default CtaSection;
