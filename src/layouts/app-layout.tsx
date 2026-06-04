import { useState } from "react";
import Sidebar from "@/components/sidebar";
import { HeaderBar } from "@/components/navbar/header-bar";
import { Outlet } from "react-router-dom";
import EditTransactionDrawer from "@/components/transaction/edit-transaction-drawer";
import AddTransactionDrawer from "@/components/transaction/add-transaction-drawer";
import LogoutDialog from "@/components/navbar/logout-dialog";
import { cn } from "@/lib/utils";

const AppLayout = () => {
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <>
      <div className="min-h-screen flex bg-[var(--bg-color)] dark:bg-background transition-colors duration-300">
        {/* Left Side: Permanent Sidebar for desktop & tablet */}
        <Sidebar
          className="hidden md:flex"
          collapsed={sidebarCollapsed}
        />

        {/* Right Side: Header and Main Content Page Area */}
        <div
          data-sidebar={sidebarCollapsed ? "collapsed" : "expanded"}
          className={cn(
            "flex-1 flex flex-col min-h-screen w-full transition-all duration-300",
            sidebarCollapsed ? "md:pl-16" : "md:pl-64"
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
      </div>

      {/* Drawers and Modal Dialogs */}
      <AddTransactionDrawer hideTrigger />
      <EditTransactionDrawer />
      <LogoutDialog
        isOpen={isLogoutDialogOpen}
        setIsOpen={setIsLogoutDialogOpen}
      />
    </>
  );
};

export default AppLayout;
