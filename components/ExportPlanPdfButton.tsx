"use client";

export function ExportPlanPdfButton() {
  function exportPdf() {
    window.print();
  }

  return (
    <button className="secondary no-print" type="button" onClick={exportPdf}>
      Export plan to PDF
    </button>
  );
}
