const terms = [
  { label: "Voice Input", highlight: false },
  { label: "Expense Tracking", highlight: false },
  { label: "Receipt Scanning", highlight: true },
  { label: "Budget Tracking", highlight: false },
  { label: "Multi-Currency", highlight: false },
  { label: "Recurring Bills", highlight: true },
  { label: "Monthly Reports", highlight: false },
  { label: "AI Categories", highlight: false },
  { label: "Spending Analytics", highlight: true },
  { label: "Transaction History", highlight: false },
  { label: "Splitwise", highlight: false },
];

const TermList = ({ aria }: { aria?: boolean }) => (
  <div
    className="font-display font-bold text-xl uppercase tracking-tighter text-muted-foreground/40 italic flex shrink-0 justify-around gap-8 min-w-full animate-marquee"
    aria-hidden={aria}
  >
    {terms.map(({ label, highlight }) => (
      <span
        key={label}
        className={highlight ? "text-primary underline decoration-brand-green-light" : ""}
      >
        {label}
      </span>
    ))}
  </div>
);

const MarqueeSection = () => {
  return (
    <section className="py-12 bg-background border-y border-border overflow-hidden">
      <div className="flex overflow-hidden select-none gap-8">
        <TermList />
        <TermList aria />
      </div>
    </section>
  );
};

export default MarqueeSection;
