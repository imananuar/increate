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
    const element = document.getElementById('invoice');
    if (element) {
      html2canvas(element, { scale: 2 }).then((canvas) => { // Scale 2 for better quality
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4'); // Portrait, mm, A4 size
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`invoice_${invoice.invoice_no}.pdf`);
      }).catch(error => {
        console.error('Error generating PDF:', error);
      });
    }
  }

}