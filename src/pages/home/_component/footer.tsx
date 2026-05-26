import { Link } from "react-router-dom";
import { Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[var(--app-dark)] text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-white/10">
      <div className="max-w-6xl mx-auto">

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 mb-12">

          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="VoiceyBill"
                className="h-7 w-7 rounded-md object-cover"
              />
              <span className="font-semibold text-base tracking-tight text-white">
                VoiceyBill
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Expense tracking with voice input, receipt scanning, and spend analytics.
            </p>
            <button
              onClick={() =>
                window.open(
                  "https://github.com/voiceyBill/voiceyBill-web",
                  "_blank"
                )
              }
              className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
            >
              <Github className="h-4 w-4" />
              voiceyBill/voiceyBill-web
            </button>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-white/30">
              Product
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Sign In", href: "/sign-in" },
                { label: "Get Started", href: "/sign-up" },
                { label: "Dashboard", href: "/overview" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className="text-sm text-white/50 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-white/30">
              GitHub
            </h4>
            <ul className="space-y-3">
              {[
                {
                  label: "Repository",
                  href: "https://github.com/voiceyBill/voiceyBill-web",
                },
                {
                  label: "Issues",
                  href: "https://github.com/voiceyBill/voiceyBill-web/issues",
                },
                {
                  label: "Pull Requests",
                  href: "https://github.com/voiceyBill/voiceyBill-web/pulls",
                },
              ].map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => window.open(item.href, "_blank")}
                    className="text-sm text-white/50 hover:text-white transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <p className="text-white/30 text-sm">© 2025 VoiceyBill. All rights reserved.</p>
          <p className="text-white/30 text-sm">Track smarter. Spend wiser.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
