import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin } from "lucide-react";
import Logo from "@/components/logo/logo";

const productLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Mobile App", href: "#mobile-app" },
  { label: "Dashboard", href: "/overview" },
];

const resourceLinks = [
  {
    label: "GitHub Repo",
    href: "https://github.com/voiceyBill/voiceyBill-web",
  },
  {
    label: "Open Issues",
    href: "https://github.com/voiceyBill/voiceyBill-web/issues",
  },
  {
    label: "Pull Requests",
    href: "https://github.com/voiceyBill/voiceyBill-web/pulls",
  },
  {
    label: "Releases",
    href: "https://github.com/voiceyBill/voiceyBill-web/releases",
  },
];

const legalLinks = [
  { label: "Sign In", href: "/sign-in" },
  { label: "Sign Up", href: "/sign-up" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-app-dark text-white pt-16 md:pt-24 pb-8 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 mb-12 md:mb-20">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <Logo url="/" />
            </div>
            <p className="text-white/40 mb-8 leading-relaxed text-sm">
              Expense tracking with voice input, receipt scanning, and real-time
              spend analytics.
            </p>
            <div className="flex gap-4">
              {[
                {
                  Icon: Github,
                  href: "https://github.com/voiceyBill/voiceyBill-web",
                  label: "GitHub",
                },
                {
                  Icon: Twitter,
                  href: "https://twitter.com",
                  label: "Twitter",
                },
                {
                  Icon: Linkedin,
                  href: "https://linkedin.com",
                  label: "LinkedIn",
                },
              ].map(({ Icon, href, label }) => (
                <button
                  key={label}
                  onClick={() => window.open(href, "_blank")}
                  className="text-white/40 cursor-pointer hover:text-brand-green-light transition-colors"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-xs uppercase tracking-widest text-white/30">
              Product
            </h4>
            <ul className="space-y-4">
              {productLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="text-white/40 hover:text-white transition-colors text-sm"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-xs uppercase tracking-widest text-white/30">
              Resources
            </h4>
            <ul className="space-y-4">
              {resourceLinks.map(({ label, href }) => (
                <li key={label}>
                  <button
                    onClick={() => window.open(href, "_blank")}
                    className="text-white/40 cursor-pointer hover:text-white transition-colors text-sm text-left"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-xs uppercase tracking-widest text-white/30">
              Legal
            </h4>
            <ul className="space-y-4">
              {legalLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="text-white/40 hover:text-white transition-colors text-sm"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 md:pt-10 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
          <div className="text-white/25 text-sm">
            © {currentYear} VoiceyBill. All rights reserved.
          </div>
          <div className="text-white/25 text-sm font-bold">
            <span className="text-brand-green-light italic">
              Track smarter.
            </span>{" "}
            Spend wiser.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
