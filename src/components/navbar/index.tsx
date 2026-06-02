import { useState } from "react";
import { Menu, Sun, Moon } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import { cn } from "@/lib/utils";
import Logo from "../logo/logo";
import { Button } from "../ui/button";
import { Sheet, SheetContent } from "../ui/sheet";
import { UserNav } from "./user-nav";
import LogoutDialog from "./logout-dialog";
import { useTypedSelector } from "@/app/hook";
import { useTheme } from "@/context/theme-provider";

const Navbar = () => {
  const { pathname } = useLocation();
  const { user } = useTypedSelector((state) => state.auth);
  const { theme, setTheme } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const routes = [
    { href: PROTECTED_ROUTES.OVERVIEW, label: "Overview" },
    { href: PROTECTED_ROUTES.TRANSACTIONS, label: "Transactions" },
    { href: PROTECTED_ROUTES.REPORTS, label: "Reports" },
    { href: PROTECTED_ROUTES.REPORTS, label: "Budget" },
    { href: PROTECTED_ROUTES.SETTINGS, label: "Settings" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-background/80 dark:bg-background/80 backdrop-blur-lg border-b border-border/40 text-foreground shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] transition-all duration-300">
        <div className="w-full flex h-14 max-w-[var(--max-width)] items-center mx-auto px-4 sm:px-6">
          <div className="w-full flex items-center justify-between">

            {/* Left: hamburger + logo */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="inline-flex md:hidden text-foreground hover:bg-muted/65 border border-transparent hover:border-border/30"
                onClick={() => setIsOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="text-foreground [&_span]:text-foreground [&_img]:opacity-95">
                <Logo />
              </div>
            </div>

            {/* Center: desktop nav */}
            <nav className="hidden md:flex items-center gap-1.5">
              {routes.map((route) => (
                <Button
                  key={route.href}
                  size="sm"
                  variant="ghost"
                  className={cn(
                    "font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 text-[13.5px] px-4 py-1.5 rounded-full border border-transparent",
                    pathname === route.href && "text-primary bg-primary/8 border-primary/20 shadow-sm font-semibold hover:bg-primary/10 hover:text-primary"
                  )}
                  asChild
                >
                  <NavLink to={route.href}>{route.label}</NavLink>
                </Button>
              ))}
            </nav>

            {/* Mobile nav drawer */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetContent side="left" className="bg-background border-r border-[var(--surface-border)] w-64 p-5">
                <div className="mb-8 pt-2">
                  <Logo />
                </div>
                <nav className="flex flex-col gap-1.5">
                  {routes.map((route) => (
                    <Button
                      key={route.href}
                      size="sm"
                      variant="ghost"
                      className={cn(
                        "w-full justify-start font-normal text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl px-4 py-2 border border-transparent transition-all duration-150",
                        pathname === route.href && "bg-primary/8 text-primary font-semibold border-primary/20"
                      )}
                      asChild
                    >
                      <NavLink to={route.href} onClick={() => setIsOpen(false)}>
                        {route.label}
                      </NavLink>
                    </Button>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>

            {/* Right: user and theme settings */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/65 border border-transparent hover:border-border/30 transition-all duration-200"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                title="Toggle Theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-[17px] w-[17px] text-primary" />
                ) : (
                  <Moon className="h-[17px] w-[17px] text-primary" />
                )}
              </Button>

              <div className="h-4 w-px bg-border/60" />

              <UserNav
                userName={user?.name || ""}
                profilePicture={user?.profilePicture || ""}
                onLogout={() => setIsLogoutDialogOpen(true)}
              />
            </div>
          </div>
        </div>
      </header>

      <LogoutDialog
        isOpen={isLogoutDialogOpen}
        setIsOpen={setIsLogoutDialogOpen}
      />
    </>
  );
};

export default Navbar;

