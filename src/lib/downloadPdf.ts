import { downloadFile } from "./downloadFile";

export function downloadPdf(blob: Blob, filename?: string): void {
  // Ensure we have a PDF blob with proper type
  const pdfBlob = new Blob([blob], {
    type: "application/pdf",
  });

  const safeName =
    filename ?? `export-${new Date().toISOString().split("T")[0]}.pdf`;

  downloadFile(pdfBlob, safeName);
}
