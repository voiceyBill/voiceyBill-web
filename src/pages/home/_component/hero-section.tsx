import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Github } from "lucide-react";
import { useTypedSelector } from "@/app/hook";

const col1 = [
  "Voice Input", "Expense Tracking", "Q1 Budget Report", "Cash Flow",
  "Income Statement", "Receipt Scanning", "Transactions", "Balance Sheet",
  "Monthly Expenses", "Savings Rate", "Tax Summary", "Annual Report",
  "Budget Overview", "Fiscal Year", "Petty Cash", "Expense Ratio",
];

const col2 = [
  "Multi-currency", "Analytics", "Budget Variance", "Categories",
  "Recurring Bills", "Financial Goals", "Dashboard View", "Net Worth",
  "Spending Limit", "Spending Trends", "Currency Exchange", "Ledger Entry",
  "Payment History", "Cash Reserves", "Bank Records", "Profit & Loss",
];

const col3 = [
  "Monthly Reports", "Income Tracking", "Expense Ratio", "Bank Records",
  "Cash Reserves", "Fiscal Quarter", "Payment History", "Budget Forecast",
  "Spending Insights", "Savings Plan", "Invoices", "Account Summary",
  "Daily Spend", "Tax Deductions", "Cost Centre", "Reconciliation",
];

const HeroSection = () => {
  const { user, accessToken } = useTypedSelector((state) => state.auth);
  const isAuthenticated = !!(user && accessToken);

  return (
    <section className="pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_420px] gap-14 lg:gap-12 items-center">

          {/* Left: Typography */}
          <div className="space-y-8">

            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/6 text-primary text-xs font-bold tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0" />
              Voice · Photo · Type
            </div>

            <h1 className="text-[clamp(3rem,7.5vw,5.5rem)] font-black tracking-tight text-foreground leading-[0.92]">
              Expense<br />
              tracking that<br />
              speaks your<br />
              <em className="italic text-primary">language.</em>
            </h1>

            <p className="text-[1.0625rem] text-muted-foreground leading-relaxed max-w-[21rem]">
              Say it, snap it, or type it. VoiceyBill logs and categorizes every
              expense — in any language, any currency.
            </p>

            <div className="flex flex-wrap gap-3">
              {isAuthenticated ? (
                <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6 rounded-md font-semibold">
                  <Link to="/overview">Go to Dashboard →</Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6 rounded-md font-semibold">
                    <Link to="/sign-up">Start tracking →</Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-11 px-6 rounded-md border-border font-semibold"
                    onClick={() => window.open("https://github.com/voiceyBill/voiceyBill-web", "_blank")}
                  >
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </Button>
                </>
              )}
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-3 flex-wrap text-sm text-muted-foreground pt-1">
              <span className="font-semibold text-foreground">iOS & Android</span>
              <span className="w-1 h-1 rounded-full bg-border inline-block" />
              <span><strong className="font-semibold text-foreground">50+</strong> languages</span>
              <span className="w-1 h-1 rounded-full bg-border inline-block" />
              <span><strong className="font-semibold text-foreground">Free</strong> to start</span>
            </div>

          </div>

          {/* Right: Scrolling text columns + logo overlay */}
          <div className="relative h-[600px] overflow-hidden">

            {/* 3 columns of dense scrolling text */}
            <div className="grid grid-cols-3 h-full">
              {[
                { items: col1, cls: "animate-scroll-up" },
                { items: col2, cls: "animate-scroll-down" },
                { items: col3, cls: "animate-scroll-up-slow" },
              ].map(({ items, cls }, colIdx) => (
                <div key={colIdx} className="overflow-hidden px-2.5">
                  <div className={`flex flex-col gap-3.5 ${cls}`}>
                    {[...items, ...items].map((term, i) => (
                      <p key={i} className="text-[10px] font-mono text-muted-foreground/30 dark:text-muted-foreground/18 whitespace-nowrap leading-snug">
                        {term}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Top + bottom fades */}
            <div className="absolute inset-x-0 top-0 h-28 pointer-events-none" style={{ background: "linear-gradient(to bottom, var(--background) 10%, transparent)" }} />
            <div className="absolute inset-x-0 bottom-0 h-28 pointer-events-none" style={{ background: "linear-gradient(to top, var(--background) 10%, transparent)" }} />

            {/* Logo centred */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative flex items-center justify-center">
                {/* Rings */}
                <div className="absolute w-80 h-80 rounded-full border border-border/30" />
                <div className="absolute w-60 h-60 rounded-full border border-primary/10" />
                <div className="absolute w-44 h-44 rounded-full border border-primary/20" />
                {/* Glow */}
                <div
                  className="absolute w-56 h-56 rounded-full"
                  style={{ background: "radial-gradient(circle, var(--primary) 0%, transparent 65%)", opacity: 0.09 }}
                />
                <img
                  src="/logo.png"
                  alt="VoiceyBill"
                  className="relative z-10 h-36 w-36 rounded-2xl object-cover"
                  style={{ filter: "drop-shadow(0 12px 40px color-mix(in srgb, var(--primary) 45%, transparent)) drop-shadow(0 2px 10px rgba(0,0,0,0.25))" }}
                />
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
