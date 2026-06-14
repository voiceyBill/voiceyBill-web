import { downloadFile } from "./downloadFile";

export function downloadCsv(blob: Blob, filename?: string): void {
  // Ensure we have a CSV blob with proper type
  const csvBlob = new Blob([blob], {
    type: "text/csv;charset=utf-8;",
  });

  const safeName =
    filename ?? `export-${new Date().toISOString().split("T")[0]}.csv`;

  downloadFile(csvBlob, safeName);
}
