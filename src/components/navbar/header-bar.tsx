import { useState } from "react";
import { Sun, Moon, Menu, PanelLeft } from "lucide-react";
import { useTypedSelector } from "@/app/hook";
import { useTheme } from "@/context/theme-provider";
import { Button } from "../ui/button";
import { Sheet, SheetContent } from "../ui/sheet";
import { UserNav } from "./user-nav";
import Sidebar from "../sidebar";
import Logo from "../logo/logo";
import { NotificationDropdown } from "./notification-dropdown";

interface HeaderBarProps {
  onLogoutClick?: () => void;
  sidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
}

export const HeaderBar = ({ onLogoutClick, sidebarCollapsed, onSidebarToggle }: HeaderBarProps) => {
  const { user } = useTypedSelector((state) => state.auth);
  const { theme, setTheme } = useTheme();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 sm:h-16 w-full items-center justify-between border-b border-zinc-150/70 dark:border-white/5 bg-background/80 px-3 sm:px-6 backdrop-blur-lg transition-all duration-300">

        {/* Left Side: Mobile Hamburger + Brand, Desktop Sidebar Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile hamburger menu */}
          <Button
            variant="ghost"
            size="icon"
            className="inline-flex md:hidden text-foreground hover:bg-muted/65 border border-transparent hover:border-border/30 rounded-xl h-8 w-8 sm:h-9 sm:w-9"
            onClick={() => setIsMobileDrawerOpen(true)}
          >
            <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>

          {/* Mobile Brand Logo — icon only on xs, full on sm */}
          <div className="flex md:hidden text-foreground [&_span]:text-foreground [&_img]:opacity-95">
            <div className="sm:hidden"><Logo compact /></div>
            <div className="hidden sm:flex"><Logo /></div>
          </div>

          {/* Desktop sidebar toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:inline-flex h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/65 border border-transparent hover:border-border/30 transition-all duration-200"
            onClick={onSidebarToggle}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* Right Side: Theme toggles, bell, and User menu */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Theme toggler */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/65 border border-transparent hover:border-border/30 transition-all duration-200"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-primary" />
            ) : (
              <Moon className="h-4 w-4 text-primary" />
            )}
          </Button>

          {/* Notifications bell — hidden on xs */}
          <div className="hidden sm:block">
            <NotificationDropdown />
          </div>

          <div className="h-4 w-px bg-zinc-150/60 dark:bg-white/5 hidden sm:block" />

          {/* User profile dropdown */}
          <UserNav
            userName={user?.name || ""}
            profilePicture={user?.profilePicture || ""}
            onLogout={onLogoutClick || (() => { })}
          />
        </div>
      </header>

      {/* Mobile Drawer Sheet Overlay */}
      <Sheet open={isMobileDrawerOpen} onOpenChange={setIsMobileDrawerOpen}>
        <SheetContent side="left" className="p-0 border-r border-zinc-150/70 dark:border-white/5 w-64 bg-transparent">
          <Sidebar
            className="fixed top-0 bottom-0 left-0 right-0 h-full w-full bg-white dark:bg-zinc-950/95"
            onLinkClick={() => setIsMobileDrawerOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </>
  );
};
