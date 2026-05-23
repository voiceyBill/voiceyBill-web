import { Button } from "@/components/ui/button";
import { DownloadCloud } from "lucide-react";

const MobileSection = () => {
  return (
    <section className="py-28 bg-[var(--surface-alt)] border-t border-[var(--surface-border)]" id="mobile-app">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid md:grid-cols-2 gap-16 items-center">

          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              &gt; Mobile app
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight">
              Log expenses anywhere.
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg max-w-sm">
              The VoiceyBill mobile app runs on iOS and Android. Voice input,
              receipt scanning, and full sync with your account — in your pocket.
            </p>
            <Button
              size="lg"
              className="bg-foreground text-background hover:bg-foreground/90 h-12 px-7"
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

          <div className="space-y-5">
            {[
              { label: "Voice-first input.", detail: "Speak in any language — the app handles transcription and logging." },
              { label: "Receipt scanning.", detail: "Camera access lets you snap receipts on the spot." },
              { label: "Synced with your account.", detail: "Everything logged on mobile appears instantly in the web dashboard." },
              { label: "Works offline.", detail: "Expenses queued without connectivity sync when you reconnect." },
            ].map((item) => (
              <div key={item.label} className="space-y-0.5">
                <p className="font-semibold text-foreground text-sm">{item.label}</p>
                <p className="text-muted-foreground text-sm">{item.detail}</p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default MobileSection;
