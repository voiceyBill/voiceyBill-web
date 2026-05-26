import { Mic, Camera, BarChart3, Globe, RefreshCw, Mail } from "lucide-react";

const FeaturesSection = () => {
  return (
    <section className="py-28 bg-[var(--surface-alt)] border-t border-border" id="features">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-5">
            &gt; What it does
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight max-w-xl">
            Everything you need to track money clearly.
          </h2>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {/* 01: Voice — large feature card */}
          <div className="group sm:col-span-2 relative overflow-hidden bg-primary/[0.04] dark:bg-primary/[0.07] border border-primary/15 rounded-2xl p-8 flex flex-col justify-between min-h-[220px] hover:border-primary/30 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className="h-11 w-11 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center text-primary">
                <Mic className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-primary/30 tabular-nums">01</span>
            </div>
            <div className="space-y-3 mt-8">
              <h3 className="text-xl font-semibold text-foreground">Voice input in any language.</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                Say "spent $12 on groceries" in English, Urdu, Arabic, or Spanish. VoiceyBill hears it and logs it immediately — no switching apps, no typing.
              </p>
            </div>
            {/* Decorative mic input chip */}
            <div className="absolute bottom-6 right-6 hidden sm:flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2 shadow-sm opacity-50 group-hover:opacity-100 transition-opacity duration-300">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-mono text-muted-foreground">"Coffee $4.50"</span>
            </div>
          </div>

          {/* 02: Receipt */}
          <div className="group bg-card border border-border rounded-2xl p-6 flex flex-col space-y-4 hover:border-primary/20 hover:shadow-md transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className="h-10 w-10 rounded-xl bg-primary/8 border border-primary/12 flex items-center justify-center text-primary group-hover:scale-105 transition-transform duration-300">
                <Camera className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-muted-foreground/40 tabular-nums">02</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-[15px] font-semibold text-foreground leading-snug">Snap a receipt, done.</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Upload any receipt image. The merchant name, date, amount, and category are pulled from it and saved — before you put your phone away.
              </p>
            </div>
          </div>

          {/* 03: Analytics */}
          <div className="group bg-card border border-border rounded-2xl p-6 flex flex-col space-y-4 hover:border-primary/20 hover:shadow-md transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className="h-10 w-10 rounded-xl bg-primary/8 border border-primary/12 flex items-center justify-center text-primary group-hover:scale-105 transition-transform duration-300">
                <BarChart3 className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-muted-foreground/40 tabular-nums">03</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-[15px] font-semibold text-foreground leading-snug">Analytics that explain your spending.</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Category breakdowns, monthly trends, and period comparisons — presented cleanly. You see exactly where your money went, not just how much.
              </p>
            </div>
            {/* Mini bar chart */}
            <div className="flex items-end gap-1 h-8 mt-auto pt-2">
              {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm transition-all" style={{ height: `${h}%`, backgroundColor: i === 5 ? "var(--primary)" : "var(--border)" }} />
              ))}
            </div>
          </div>

          {/* 04: Multi-currency */}
          <div className="group bg-card border border-border rounded-2xl p-6 flex flex-col space-y-4 hover:border-primary/20 hover:shadow-md transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className="h-10 w-10 rounded-xl bg-primary/8 border border-primary/12 flex items-center justify-center text-primary group-hover:scale-105 transition-transform duration-300">
                <Globe className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-muted-foreground/40 tabular-nums">04</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-[15px] font-semibold text-foreground leading-snug">Multi-currency, everywhere.</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Track in USD, EUR, PKR, AED, or any other currency. Expenses are stored with the currency you set — no manual conversion, no extra steps.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
              {["USD", "EUR", "PKR", "AED"].map((c) => (
                <span key={c} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/8 text-primary border border-primary/15">{c}</span>
              ))}
            </div>
          </div>

          {/* 05: Recurring */}
          <div className="group bg-card border border-border rounded-2xl p-6 flex flex-col space-y-4 hover:border-primary/20 hover:shadow-md transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className="h-10 w-10 rounded-xl bg-primary/8 border border-primary/12 flex items-center justify-center text-primary group-hover:scale-105 transition-transform duration-300">
                <RefreshCw className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-muted-foreground/40 tabular-nums">05</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-[15px] font-semibold text-foreground leading-snug">Recurring transactions, handled.</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Set a subscription or regular bill once. VoiceyBill tracks every future occurrence without manual input on your part.
              </p>
            </div>
          </div>

          {/* 06: Reports — full-width horizontal */}
          <div className="group sm:col-span-3 bg-card border border-border rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-5 hover:border-primary/20 hover:shadow-md transition-all duration-300">
            <div className="h-10 w-10 rounded-xl bg-primary/8 border border-primary/12 flex items-center justify-center text-primary shrink-0 group-hover:scale-105 transition-transform duration-300">
              <Mail className="w-4 h-4" />
            </div>
            <div className="sm:flex-1 sm:flex sm:items-center sm:justify-between sm:gap-8">
              <div className="flex items-baseline gap-2 mb-2 sm:mb-0">
                <span className="text-[11px] font-bold text-muted-foreground/40 tabular-nums">06</span>
                <h3 className="text-[15px] font-semibold text-foreground">Monthly reports to your inbox.</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed sm:max-w-lg">
                A full breakdown of the month arrives in your email automatically. No dashboard login required to know where your money went.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
