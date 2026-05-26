import { parseAsBoolean, parseAsStringEnum, useQueryState } from "nuqs";

type TransactionMode = "voice" | "scan" | "manual";

const useAddTransactionDrawer = () => {
  const [open, setOpen] = useQueryState(
    "addTransaction",
    parseAsBoolean.withDefault(false)
  );
  const [mode, setMode] = useQueryState(
    "addMode",
    parseAsStringEnum<TransactionMode>(["voice", "scan", "manual"]).withDefault("voice")
  );

  const onOpenDrawer = (initialMode: TransactionMode = "voice") => {
    setMode(initialMode);
    setOpen(true);
  };

  const onCloseDrawer = () => {
    setOpen(false);
    setMode("voice");
  };

  return { open, mode, setMode, onOpenDrawer, onCloseDrawer };
};

export default useAddTransactionDrawer;
