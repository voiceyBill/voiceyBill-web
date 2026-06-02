import { Mic, Camera, BarChart3, Globe, RefreshCw, FileText } from "lucide-react";

const FeaturesSection = () => {
  return (
    <section className="py-32 bg-surface-alt" id="features">
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <span className="text-primary font-bold tracking-widest text-xs uppercase mb-4 block">
              01. CORE FEATURES
            </span>
            <h2 className="font-display font-bold text-4xl md:text-6xl tracking-tight text-foreground">
              Everything you need to{" "}
              <span className="text-muted-foreground">track money clearly.</span>
            </h2>
          </div>
          <div className="md:pb-2">
            <p className="text-muted-foreground max-w-sm">
              Built for global citizens who don't have time for manual data entry.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6">

          {/* Voice — lg:col-span-8 */}
          <div className="md:col-span-3 lg:col-span-8 bg-card rounded-3xl p-10 border border-border flex flex-col justify-between overflow-hidden relative group transition-all">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-brand-green-light rounded-2xl flex items-center justify-center mb-8">
                <Mic className="w-6 h-6 text-brand-green" />
              </div>
              <h3 className="font-display font-bold text-3xl mb-4 text-foreground">Voice input in 50+ languages</h3>
              <p className="text-muted-foreground max-w-md">
                Say "spent $12 on groceries" in English, Urdu, Arabic, or Spanish. VoiceyBill hears it, understands the context, and logs it immediately.
              </p>
            </div>
            <div className="mt-12 flex flex-wrap items-center gap-2">
              {['"Coffee $4.50"', '"Lunch 15 EUR"', '"Taxi PKR 2500"'].map((chip, i) => (
                <div
                  key={chip}
                  className={`px-4 py-2 rounded-full text-xs font-bold italic ${
                    i === 2
                      ? "bg-foreground text-background underline decoration-brand-green-light"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {chip}
                </div>
              ))}
            </div>
            <div className="absolute right-0 bottom-0 w-64 opacity-10 pointer-events-none">
              <svg viewBox="0 0 200 100" className="w-full">
                <path d="M0 50 Q 25 20 50 50 T 100 50 T 150 50 T 200 50" fill="none" stroke="currentColor" strokeWidth="4" className="text-primary" />
              </svg>
            </div>
          </div>

          {/* Receipt — dark primary */}
          <div className="md:col-span-3 lg:col-span-4 bg-primary rounded-3xl p-10 text-primary-foreground flex flex-col justify-between group hover:bg-primary/90 transition-all">
            <div>
              <div className="w-12 h-12 bg-primary-foreground/10 border border-primary-foreground/20 rounded-2xl flex items-center justify-center mb-8">
                <Camera className="w-6 h-6 text-brand-green-light" />
              </div>
              <h3 className="font-display font-bold text-3xl mb-4">Snap a receipt, you're done.</h3>
              <p className="text-primary-foreground/60 leading-relaxed">
                OCR tech pulls merchant, date, and amount before you put your phone away.
              </p>
            </div>
            <div className="mt-8 pt-8 border-t border-primary-foreground/10">
              <div className="flex items-center gap-3 bg-primary-foreground/5 rounded-xl p-3">
                <div className="w-10 h-10 bg-primary-foreground rounded-lg flex items-center justify-center shrink-0">
                  <FileText className="text-primary w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold">Processing Receipt...</div>
                  <div className="text-[10px] text-brand-green-light font-semibold">98.2% Accuracy</div>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics */}
          <div className="lg:col-span-4 bg-card rounded-3xl p-10 border border-border flex flex-col transition-all">
            <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center mb-8">
              <BarChart3 className="w-6 h-6 text-foreground" />
            </div>
            <h3 className="font-display font-bold text-2xl mb-4 text-foreground">Deep Spending Analytics</h3>
            <p className="text-muted-foreground leading-relaxed">
              Category breakdowns and monthly trends presented cleanly with predictive insights.
            </p>
            <div className="flex items-end gap-1.5 h-12 mt-auto pt-6">
              {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm transition-all"
                  style={{ height: `${h}%`, backgroundColor: i === 5 ? "var(--brand-green-light)" : "var(--border)" }}
                />
              ))}
            </div>
          </div>

          {/* Multi-currency — neon */}
          <div className="lg:col-span-4 bg-brand-green-light rounded-3xl p-10 flex flex-col hover:brightness-95 transition-all">
            <div className="w-12 h-12 bg-brand-green rounded-2xl flex items-center justify-center mb-8">
              <Globe className="w-6 h-6 text-brand-green-light" />
            </div>
            <h3 className="font-display font-bold text-2xl text-brand-green mb-4">
              Multi-currency, everywhere.
            </h3>
            <p className="text-brand-green/70 font-medium leading-relaxed">
              USD, EUR, PKR, AED, or any other currency. Stored without manual conversion.
            </p>
            <div className="flex gap-2 mt-auto pt-6">
              {["USD", "EUR", "AED", "PKR"].map((code) => (
                <span key={code} className="px-2.5 py-1 bg-brand-green text-brand-green-light text-[10px] font-black rounded-md">
                  {code}
                </span>
              ))}
            </div>
          </div>

          {/* Recurring */}
          <div className="lg:col-span-4 bg-card rounded-3xl p-10 border border-border flex flex-col transition-all">
            <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center mb-8">
              <RefreshCw className="w-6 h-6 text-foreground" />
            </div>
            <h3 className="font-display font-bold text-2xl mb-4 text-foreground">Recurring Bills</h3>
            <p className="text-muted-foreground leading-relaxed">
              Set it once. VoiceyBill tracks every future occurrence automatically.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
