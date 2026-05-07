import { Mic, Camera, BarChart3, Globe, RefreshCw, Mail } from "lucide-react";

const features = [
  {
    number: "01",
    icon: Mic,
    title: "Voice input in any language.",
    description:
      "Say \"spent $12 on groceries\" in English, Urdu, Arabic, or Spanish. VoiceyBill understands you and logs it immediately — no switching apps, no typing.",
  },
  {
    number: "02",
    icon: Camera,
    title: "Snap a receipt, done.",
    description:
      "Upload any receipt image. The AI reads the merchant name, date, amount, and category. Your transaction is logged before you put your phone away.",
  },
  {
    number: "03",
    icon: BarChart3,
    title: "Analytics that explain your spending.",
    description:
      "Category breakdowns, monthly trends, and period comparisons — presented cleanly. You see exactly where your money went, not just how much.",
  },
  {
    number: "04",
    icon: Globe,
    title: "Multi-currency, everywhere.",
    description:
      "Track in USD, EUR, GBP, AED, or any other currency. Expenses are stored with the currency you set — no manual conversion, no extra steps.",
  },
  {
    number: "05",
    icon: RefreshCw,
    title: "Recurring transactions, handled.",
    description:
      "Set a subscription or regular bill once. VoiceyBill tracks every future occurrence without manual input on your part.",
  },
  {
    number: "06",
    icon: Mail,
    title: "Monthly reports to your inbox.",
    description:
      "A full breakdown of the month arrives in your email automatically. No dashboard login required to know where your money went.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-28 bg-[var(--surface-alt)] border-t border-[var(--surface-border)]" id="features">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-6">
            &gt; What it does
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight max-w-xl">
            Everything you need to track money clearly.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-x-16 gap-y-14">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.number} className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-muted-foreground/60 tabular-nums">
                    {feature.number}
                  </span>
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground leading-snug">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;
