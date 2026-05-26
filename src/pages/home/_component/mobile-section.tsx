import { Button } from "@/components/ui/button";
import { DownloadCloud, Mic, Camera, RefreshCw, WifiOff } from "lucide-react";

const mobileFeatures = [
  {
    icon: Mic,
    title: "Voice-first input.",
    detail: "Speak in any language — the app records and logs your expense on the spot.",
    accent: true,
  },
  {
    icon: Camera,
    title: "Receipt scanning.",
    detail: "Camera access lets you snap receipts on the spot.",
    accent: false,
  },
  {
    icon: RefreshCw,
    title: "Synced with your account.",
    detail: "Everything logged on mobile appears instantly in the web dashboard.",
    accent: false,
  },
  {
    icon: WifiOff,
    title: "Works offline.",
    detail: "Expenses queued without connectivity sync when you reconnect.",
    accent: false,
  },
];

const MobileSection = () => {
  return (
    <section
      className="py-28 bg-[var(--surface-alt)] border-t border-border"
      id="mobile-app"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* Left: Copy */}
          <div className="space-y-7">
            <div className="space-y-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                &gt; Mobile app
              </p>
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight">
                Log expenses<br />anywhere.
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg max-w-sm">
                The VoiceyBill mobile app runs on iOS and Android. Voice input,
                receipt scanning, and full sync with your account — in your pocket.
              </p>
            </div>

            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6 rounded-md text-sm font-semibold"
              onClick={() =>
                window.open(
                  "https://expo.dev/accounts/voiceybill/projects/voiceybill-mobile/builds/5304e9d8-ee61-4716-a1eb-ef4086d72183",
                  "_blank"
                )
              }
            >
              <DownloadCloud className="mr-2 h-4 w-4" />
              Download beta
            </Button>
          </div>

          {/* Right: Feature cards */}
          <div className="grid grid-cols-2 gap-3">
            {mobileFeatures.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className={`group rounded-2xl p-5 flex flex-col gap-3 border transition-all duration-300 ${
                    item.accent
                      ? "bg-primary/[0.06] border-primary/20 hover:border-primary/35"
                      : "bg-card border-border hover:border-primary/20 hover:shadow-md"
                  }`}
                >
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center border group-hover:scale-105 transition-transform duration-300 ${
                    item.accent
                      ? "bg-primary/10 border-primary/20 text-primary"
                      : "bg-primary/8 border-primary/12 text-primary"
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm leading-snug">{item.title}</p>
                    <p className="text-muted-foreground text-xs mt-1 leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};

export default MobileSection;
