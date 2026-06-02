import { Zap, CloudOff, User, Bell, Mic } from "lucide-react";

const highlights = [
  { icon: Zap, title: "Instant Sync", detail: "Real-time dashboard updates across all your devices." },
  { icon: CloudOff, title: "Offline Mode", detail: "Queue expenses without signal; we'll sync when you're back." },
];

const MobileSection = () => {
  return (
    <section
      className="py-8 sm:py-16 bg-brand-green rounded-[2rem] sm:rounded-[3rem] mx-3 sm:mx-4 mb-16 lg:mb-32 text-white overflow-hidden relative"
      id="mobile-app"
    >
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-green-light/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-20">

          <div>
            <span className="text-brand-green-light font-bold tracking-widest text-xs uppercase mb-4 sm:mb-6 block">
              03. GO MOBILE
            </span>
            <h2 className="font-display font-bold text-4xl sm:text-5xl md:text-7xl leading-tight mb-6 sm:mb-8">
              Log expenses <br />
              <span className="text-brand-green-light italic">anywhere.</span>
            </h2>
            <p className="text-white/60 text-base sm:text-lg mb-8 sm:mb-12 max-w-md">
              The VoiceyBill app runs on iOS and Android. Voice-first, offline-ready, and perfectly synced with your web account.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
              {highlights.map(({ icon: Icon, title, detail }) => (
                <div key={title} className="flex gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-brand-green-light" />
                  </div>
                  <div>
                    <div className="font-bold mb-1">{title}</div>
                    <p className="text-white/50 text-sm">{detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 sm:gap-4">
              <button
                onClick={() => window.open("https://expo.dev/accounts/voiceybill/projects/voiceybill-mobile/builds/5304e9d8-ee61-4716-a1eb-ef4086d72183", "_blank")}
                className="bg-white text-brand-green font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-2xl flex items-center gap-2 hover:bg-brand-green-light transition-all"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                App Store
              </button>
              <button
                onClick={() => window.open("https://expo.dev/accounts/voiceybill/projects/voiceybill-mobile/builds/5304e9d8-ee61-4716-a1eb-ef4086d72183", "_blank")}
                className="bg-white/10 border border-white/20 text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-2xl flex items-center gap-2 hover:bg-white/20 transition-all"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.18 23.76c.3.17.64.17.96-.01l13.54-7.84-2.93-2.93-11.57 10.78zm-1.44-21.1c-.05.17-.08.36-.08.57v19.54c0 .21.03.4.08.57l.07.07 10.94-10.94v-.26L1.81 2.59l-.07.07zm19.64 8.37-3.07-1.77-3.24 3.24 3.24 3.24 3.08-1.78c.88-.51.88-1.34-.01-1.93zm-16.57 9.26L16.35 12 13.11 8.76 1.81 2.59l.07.07c-.01 0 .93 17.63.93 17.63z" />
                </svg>
                Google Play
              </button>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-[260px] sm:w-[300px] md:w-[340px] h-[540px] sm:h-[600px] md:h-[680px] bg-app-dark border-[8px] border-white/10 rounded-[3rem] shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 sm:w-32 h-6 bg-white/10 rounded-b-2xl z-20" />
              <div className="p-5 sm:p-6 pt-12 bg-background h-full">
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <div className="w-8 h-8 rounded-full bg-brand-green-light/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Bell className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="mb-8 sm:mb-10">
                  <div className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest mb-1">
                    Total Spend This Week
                  </div>
                  <div className="font-display font-bold text-2xl sm:text-3xl text-foreground">$842.00</div>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  {[{ w: "w-16 sm:w-20" }, { w: "w-20 sm:w-24" }].map((_, i) => (
                    <div key={i} className="p-3 sm:p-4 bg-surface-alt rounded-2xl flex items-center justify-between border border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-muted shrink-0" />
                        <div className={`h-2.5 ${_.w} bg-muted rounded`} />
                      </div>
                      <div className="h-2.5 w-8 sm:w-10 bg-muted rounded" />
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 sm:w-20 sm:h-20 bg-brand-green-light rounded-full shadow-lg flex items-center justify-center border-[6px] sm:border-8 border-background cursor-pointer">
                  <Mic className="w-6 h-6 sm:w-8 sm:h-8 text-brand-green" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default MobileSection;
