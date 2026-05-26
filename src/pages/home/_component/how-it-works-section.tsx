const steps = [
  {
    number: "01",
    title: "Log the expense.",
    description: "Speak it in your language, upload a receipt photo, or type it in. All three routes end at the same place — a saved, categorized transaction.",
    visual: (
      <div className="flex flex-wrap gap-1.5 mt-4">
        {["🎤 Voice", "📷 Photo", "⌨️ Type"].map((m) => (
          <span key={m} className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-primary/8 text-primary border border-primary/15">
            {m}
          </span>
        ))}
      </div>
    ),
  },
  {
    number: "02",
    title: "It lands in the right place.",
    description: "The amount, merchant, date, and category are read from what you shared and saved. Nothing to fill in, nothing to confirm.",
    visual: (
      <div className="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--surface-alt)] border border-border text-xs font-mono text-muted-foreground">
        <span>☕</span>
        <span>Food & Dining</span>
        <span className="text-primary font-bold ml-1">$4.50</span>
      </div>
    ),
  },
  {
    number: "03",
    title: "See the full picture.",
    description: "Your dashboard shows spending by category, by week, and by month. The monthly email report delivers it to your inbox whether you log in or not.",
    visual: (
      <div className="mt-4 flex items-end gap-1 h-10">
        {[38, 60, 42, 75, 50, 88, 65].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm"
            style={{ height: `${h}%`, backgroundColor: i === 5 ? "var(--primary)" : "var(--border)" }}
          />
        ))}
      </div>
    ),
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-28 bg-background border-t border-border" id="how-it-works">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-5">
            &gt; How it works
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight max-w-lg">
            Three steps. No setup required.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, idx) => (
            <div key={step.number} className="relative group bg-[var(--surface-alt)] border border-border rounded-2xl p-7 flex flex-col hover:border-primary/20 hover:shadow-md transition-all duration-300">

              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute top-[44px] left-[calc(100%_+_0px)] w-6 h-px border-t border-dashed border-border z-0" />
              )}

              {/* Number circle */}
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/8 border border-primary/20 text-primary text-sm font-bold mb-5">
                {step.number}
              </div>

              <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mt-2">{step.description}</p>

              {/* Mini visual */}
              <div className="mt-auto">{step.visual}</div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowItWorksSection;
