import { useShortcutsModal } from "@/context/shortcuts-modal-context";

const shortcuts = {
  Navigation: [
    { key: "O", desc: "Overview" },
    { key: "T", desc: "Transactions" },
    { key: "B", desc: "Budget" },
    { key: "R", desc: "Reports" },
  ],
  Actions: [
    { key: "N", desc: "Add transaction" },
    { key: "E", desc: "Export transactions" },
    { key: "/", desc: "Focus search" },
    { key: "H", desc: "Show shortcuts" },
    { key: "Esc", desc: "Close / dismiss" },
  ],
};

export function ShortcutsModal() {
  const { open, setOpen } = useShortcutsModal();
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-[420px] rounded-xl border border-border bg-background shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard shortcuts"
      >
        <div className="flex items-center justify-between rounded-t-xl bg-[#0d2b1e] px-5 py-4">
          <span className="flex items-center gap-2 text-sm font-medium text-[#9FE1CB]">
            ⌨️ Keyboard shortcuts
          </span>
          <button
            onClick={() => setOpen(false)}
            className="text-[#5DCAA5] hover:text-white"
            aria-label="Close shortcuts modal"
          >
            ✕
          </button>
        </div>

        <div className="p-5">
          {Object.entries(shortcuts).map(([group, items]) => (
            <div key={group} className="mb-4">
              <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                {group}
              </p>
              {items.map(({ key, desc }) => (
                <div
                  key={key}
                  className="flex items-center justify-between border-b border-border py-2 last:border-0"
                >
                  <span className="text-sm text-foreground">{desc}</span>
                  <kbd className="rounded border border-border bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
                    {key}
                  </kbd>
                </div>
              ))}
            </div>
          ))}
          <p className="mt-2 text-xs text-muted-foreground">
            Shortcuts are disabled when typing in an input field.
          </p>
        </div>
      </div>
    </div>
  );
}
