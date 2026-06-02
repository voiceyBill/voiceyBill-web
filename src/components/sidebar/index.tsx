import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowUpDown,
  BarChart3,
  Settings,
  LogOut,
  Mic,
  Sparkles,
  Wallet,
} from "lucide-react";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import LogoutDialog from "../navbar/logout-dialog";
import useAddTransactionDrawer from "@/hooks/use-add-transaction-drawer";

interface SidebarProps {
  className?: string;
  onLinkClick?: () => void;
  collapsed?: boolean;
}

const Sidebar = ({ className, onLinkClick, collapsed = false }: SidebarProps) => {
  const { pathname } = useLocation();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const { onOpenDrawer } = useAddTransactionDrawer();

  const routes = [
    { href: PROTECTED_ROUTES.OVERVIEW, label: "Overview", Icon: LayoutDashboard },
    { href: PROTECTED_ROUTES.TRANSACTIONS, label: "Transactions", Icon: ArrowUpDown },
    { href: PROTECTED_ROUTES.BUDGET, label: "Budget", Icon: Wallet },
    { href: PROTECTED_ROUTES.REPORTS, label: "Reports", Icon: BarChart3 },
    { href: PROTECTED_ROUTES.SETTINGS, label: "Settings", Icon: Settings },
  ];

  return (
    <>
      <aside
        className={cn(
          "flex flex-col h-screen fixed left-0 top-0 bg-white/70 dark:bg-zinc-950/25 border-r border-zinc-150/70 dark:border-white/5 py-6 z-40 backdrop-blur-xl transition-all duration-300 justify-between overflow-hidden",
          collapsed ? "w-16 px-2" : "w-64 px-4",
          className
        )}
      >
        <div className="flex flex-col gap-8">
          {/* Logo */}
          <div className={cn("transition-all duration-300", collapsed ? "flex justify-center" : "px-3")}>
            {collapsed ? (
              <img src="/logo.png" alt="VoiceyBill" className="h-8 w-8 rounded-lg object-cover flex-shrink-0" />
            ) : (
              <NavLink to={PROTECTED_ROUTES.OVERVIEW} className="flex items-center gap-2.5">
                <img src="/logo.png" alt="VoiceyBill" className="h-8 w-8 flex-shrink-0 rounded-lg object-cover" />
                <span className="font-semibold text-[17px] tracking-tight whitespace-nowrap">VoiceyBill</span>
              </NavLink>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            {routes.map((route) => {
              const Icon = route.Icon;
              const isActive = pathname === route.href;
              return (
                <Button
                  key={route.href}
                  size="sm"
                  variant="ghost"
                  className={cn(
                    "w-full font-semibold text-[13.5px] rounded-full border border-transparent transition-all duration-300 group",
                    collapsed ? "justify-center px-0 py-2.5" : "justify-start gap-3.5 px-4 py-2.5",
                    isActive
                      ? "text-primary bg-primary/8 border-primary/20 dark:text-brand-green-light dark:bg-brand-green-light/8 dark:border-brand-green-light/10 shadow-[0_2px_12px_-4px_rgba(22,97,20,0.06)] dark:shadow-[0_2px_12px_-4px_rgba(159,255,89,0.06)]"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                  asChild
                >
                  <NavLink to={route.href} onClick={onLinkClick} title={collapsed ? route.label : undefined}>
                    <Icon
                      className={cn(
                        "h-[17px] w-[17px] shrink-0 transition-transform duration-300 group-hover:scale-110",
                        isActive
                          ? "text-primary dark:text-brand-green-light"
                          : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                    {!collapsed && <span>{route.label}</span>}
                  </NavLink>
                </Button>
              );
            })}

          </nav>
        </div>

        {/* Bottom section */}
        <div className="flex flex-col gap-4">
          {/* VoiceyAI Promo Card — hidden when collapsed */}
          {!collapsed && (
            <div className="relative overflow-hidden p-4 rounded-2xl border border-zinc-150/80 dark:border-white/5 bg-zinc-50/50 dark:bg-white/[0.01] backdrop-blur-md shadow-sm group">
              <div className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-brand-green/5 dark:bg-brand-green-light/3 blur-xl group-hover:scale-125 transition-all duration-500 pointer-events-none" />
              <div className="flex items-start gap-2.5 z-10 relative">
                <div className="h-7 w-7 rounded-lg bg-primary/8 dark:bg-brand-green-light/8 flex items-center justify-center text-primary dark:text-brand-green-light">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1">
                  <p className="text-[11.5px] font-extrabold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                    VoiceyAI Input
                  </p>
                  <p className="text-[10.5px] text-muted-foreground mt-0.5 leading-relaxed font-medium">
                    Add transactions seamlessly using your voice!
                  </p>
                </div>
              </div>
              <div className="mt-3.5 flex items-center justify-between bg-white dark:bg-zinc-900/50 border border-zinc-150/50 dark:border-white/5 p-2 rounded-xl">
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest pl-1.5">
                  Ready to record
                </span>
                <div
                  className="h-7 w-7 rounded-full bg-brand-green dark:bg-brand-green-light flex items-center justify-center shadow-md dark:shadow-brand-green-light/10 text-white dark:text-zinc-950 animate-voice-pulse hover:scale-105 transition-all duration-300 cursor-pointer"
                  onClick={() => onOpenDrawer("voice")}
                >
                  <Mic className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          )}

          {/* Mic icon only when collapsed */}
          {collapsed && (
            <div className="flex justify-center">
              <div
                className="h-8 w-8 rounded-full bg-brand-green dark:bg-brand-green-light flex items-center justify-center shadow-md text-white dark:text-zinc-950 animate-voice-pulse hover:scale-105 transition-all duration-300 cursor-pointer"
                onClick={() => onOpenDrawer("voice")}
                title="Add transaction by voice"
              >
                <Mic className="h-3.5 w-3.5" />
              </div>
            </div>
          )}

          <div className="h-px bg-zinc-150/60 dark:bg-white/5 w-full" />

          {/* Logout */}
          <Button
            size="sm"
            variant="ghost"
            className={cn(
              "w-full font-semibold text-[13.5px] text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:text-rose-350 dark:hover:bg-rose-950/10 rounded-full border border-transparent transition-all duration-200 group",
              collapsed ? "justify-center px-0 py-2.5" : "justify-start gap-3.5 px-4 py-2.5"
            )}
            onClick={() => setIsLogoutDialogOpen(true)}
          >
            <LogOut className="h-[17px] w-[17px] shrink-0 text-rose-500 dark:text-rose-450 transition-transform duration-300 group-hover:-translate-x-0.5" />
            {!collapsed && <span>Log Out</span>}
          </Button>
        </div>
      </aside>

      <LogoutDialog
        isOpen={isLogoutDialogOpen}
        setIsOpen={setIsLogoutDialogOpen}
      />
    </>
  );
};

export default Sidebar;
