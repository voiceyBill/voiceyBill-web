import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import useAddTransactionDrawer from "@/hooks/use-add-transaction-drawer";
import { useShortcutsModal } from "@/context/shortcuts-modal-context";

export function useKeyboardShortcuts() {
  const navigate = useNavigate();
  const { onOpenDrawer, onCloseDrawer } = useAddTransactionDrawer();
  const { setOpen: setShortcutsOpen } = useShortcutsModal();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName ?? "").toLowerCase();
      if (["input", "textarea", "select"].includes(tag)) return;

      switch (e.key) {
        case "n":
        case "N":
          onOpenDrawer("voice");
          break;
        case "e":
        case "E":
          navigate(`${PROTECTED_ROUTES.TRANSACTIONS}?export=true`);
          break;
        case "b":
        case "B":
          navigate(PROTECTED_ROUTES.BUDGET);
          break;
        case "t":
        case "T":
          navigate(PROTECTED_ROUTES.TRANSACTIONS);
          break;
        case "r":
        case "R":
          navigate(PROTECTED_ROUTES.REPORTS);
          break;
        case "o":
        case "O":
          navigate(PROTECTED_ROUTES.OVERVIEW);
          break;
        case "/":
          e.preventDefault();
          document.querySelector<HTMLInputElement>("[data-search]")?.focus();
          break;
        case "h":
        case "H":
          setShortcutsOpen(true);
          break;
        case "Escape":
          setShortcutsOpen(false);
          onCloseDrawer();
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate, onOpenDrawer, onCloseDrawer, setShortcutsOpen]);
}
