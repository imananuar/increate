import { HttpClient } from "@angular/common/http";
import { ElementRef, Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { Invoice } from "../model/invoice.model";
import { environment } from "../../environments/environment";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

@Injectable({
    providedIn: 'root'
})
export class InvoiceService {
    constructor(
        private http: HttpClient
    ) {}

    getInvoiceById(invoiceId: string): Observable<Invoice> {
        return this.http.get<Invoice>(`${environment.apiUrl}/invoice/getInvoiceById/${invoiceId}`);
    }
    
  downloadInvoice(invoice: Invoice) {
    const element = document.getElementById('invoice-pdf'); // Use hidden desktop-styled invoice
    if (!element) {
      console.error('Invoice PDF element not found');
      return;
    }

    console.log(element);
    element.style.display = 'inline';
    element.style.position = 'fixed';
    element.style.left = '0';
    element.style.top = '0';
    element.style.zIndex = '-1'; // Keep behind other content

    if (element) {
      html2canvas(element, { 
        scale: 2, // High-quality rendering
        useCORS: true, // Handle external resources if any
        logging: false, // Clean console
        width: 894, // A4 width in pixels at 96dpi
        windowWidth: 1280, // Simulate desktop viewport
        allowTaint: true, // Allow rendering of potentially tainted content
        removeContainer: true // Clean up cloned DOM
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png', 1.0);
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`invoice_${invoice.invoice_no}.pdf`);

        // Clean up
        // element.style.visibility = 'hidden';
        // element.style.position = 'absolute';
        // element.style.left = '-9999px';
        // element.style.zIndex = '0';
      }).catch(error => {
        console.error('Error generating PDF:', error);
        // element.style.visibility = 'hidden';
        // element.style.position = 'absolute';
        // element.style.left = '-9999px';
        // element.style.zIndex = '0';
      });
    }
  }

}