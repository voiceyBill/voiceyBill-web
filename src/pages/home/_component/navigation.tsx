import { Button } from "@/components/ui/button";
import Logo from "@/components/logo/logo";
import { Link } from "react-router-dom";
import { useTypedSelector } from "@/app/hook";
import { useState, useEffect } from "react";

interface HomeNavigationProps {
  scrollToSection: (sectionId: string) => void;
  scrollToTop: () => void;
}

const Navigation = ({ scrollToSection, scrollToTop }: HomeNavigationProps) => {
  const { user, accessToken } = useTypedSelector((state) => state.auth);
  const isAuthenticated = !!(user && accessToken);

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 10);
      if (currentScrollY < 10) setIsVisible(true);
      else if (currentScrollY > lastScrollY && currentScrollY > 100) setIsVisible(false);
      else if (currentScrollY < lastScrollY) setIsVisible(true);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  const navLinks = [
    { label: "Features", id: "features" },
    { label: "How it works", id: "how-it-works" },
    { label: "Mobile", id: "mobile-app" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border"
          : "bg-background/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <div onClick={scrollToTop} className="cursor-pointer">
            <Logo url="/" />
          </div>

          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer font-medium"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <Button size="sm" asChild className="bg-primary text-primary-foreground hover:bg-primary/90 px-5 rounded-md font-semibold">
                <Link to="/overview">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild className="text-sm font-medium text-muted-foreground hover:text-foreground">
                  <Link to="/sign-in">Sign in</Link>
                </Button>
                <Button size="sm" asChild className="bg-primary text-primary-foreground hover:bg-primary/90 px-5 rounded-md font-semibold">
                  <Link to="/sign-up">Get started</Link>
                </Button>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navigation;
