export function downloadFile(blob: Blob, filename: string): void {
  // Create a URL for the blob
  const url = window.URL.createObjectURL(blob);

  // Create a temporary anchor element
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;

  // Append to body, click, and remove
  document.body.appendChild(link);
  link.click();

  // Clean up
  setTimeout(() => {
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }, 100);
}
