'use client';

import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Downloads a DOM element as a PDF using html2canvas + jsPDF.
 * Captures the element at 2x DPI for crisp rendering on A4.
 *
 * @param elementId - The `id` attribute of the element to capture (e.g. "invoice-payload")
 * @param filename  - The desired filename without extension (e.g. "INV-2025-001")
 * @param title     - Optional title printed in the PDF metadata
 */
export async function downloadElementAsPdf(
  elementId: string,
  filename: string,
  title?: string,
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`[downloadPdf] Element with id "${elementId}" not found`);
    return;
  }

  // Temporarily hide no-print elements within the capture zone
  const noPrintElements = element.querySelectorAll<HTMLElement>('.no-print');
  noPrintElements.forEach((el) => (el.style.display = 'none'));

  try {
    // Capture at 2x DPI for retina-quality rendering
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.setProperties({
      title: title || filename,
      subject: 'Invoice',
      author: 'Bold Ideas',
      keywords: 'invoice, bold ideas',
    });

    // If image is taller than one page, add pages
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdf.internal.pageSize.getHeight();

    while (heightLeft > 0) {
      position = heightLeft - imgHeight; // negative offset for next page
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();
    }

    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('[downloadPdf] Error generating PDF:', error);
    throw error;
  } finally {
    // Restore no-print elements
    noPrintElements.forEach((el) => (el.style.display = ''));
  }
}
