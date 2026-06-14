import { useState } from "react";
import Sidebar from "@/components/sidebar";
import { HeaderBar } from "@/components/navbar/header-bar";
import { Outlet } from "react-router-dom";
import EditTransactionDrawer from "@/components/transaction/edit-transaction-drawer";
import AddTransactionDrawer from "@/components/transaction/add-transaction-drawer";
import LogoutDialog from "@/components/navbar/logout-dialog";
import { cn } from "@/lib/utils";
import { ShortcutsModalProvider } from "@/context/shortcuts-modal-context";
import { ShortcutsModal } from "@/components/shortcuts-modal";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

const AppLayoutInner = () => {
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  useKeyboardShortcuts(); // ✅ now inside the provider

  return (
    <div className="min-h-screen flex bg-[var(--bg-color)] dark:bg-background transition-colors duration-300">
      <Sidebar className="hidden md:flex" collapsed={sidebarCollapsed} />
      <div
        data-sidebar={sidebarCollapsed ? "collapsed" : "expanded"}
        className={cn(
          "flex-1 flex flex-col min-h-screen w-full transition-all duration-300",
          sidebarCollapsed ? "md:pl-16" : "md:pl-64",
        )}
      >
        <HeaderBar
          onLogoutClick={() => setIsLogoutDialogOpen(true)}
          sidebarCollapsed={sidebarCollapsed}
          onSidebarToggle={() => setSidebarCollapsed((v) => !v)}
        />
        <main className="w-full flex-1 flex flex-col">
          <Outlet />
        </main>
      </div>
      <AddTransactionDrawer hideTrigger />
      <EditTransactionDrawer />
      <LogoutDialog
        isOpen={isLogoutDialogOpen}
        setIsOpen={setIsLogoutDialogOpen}
      />
      <ShortcutsModal />
    </div>
  );
};

const AppLayout = () => (
  <ShortcutsModalProvider>
    <AppLayoutInner />
  </ShortcutsModalProvider>
);

export default AppLayout;
