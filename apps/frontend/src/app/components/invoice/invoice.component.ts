import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Invoice } from '../../model/invoice.model';
import { ActivatedRoute } from '@angular/router';
import { InvoiceService } from '../../services/invoice.service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-invoice',
  imports: [CommonModule, DatePipe],
  templateUrl: './invoice.component.html'
})
export class InvoiceComponent implements OnInit {
  @ViewChild('invoiceSection') invoiceSection!: ElementRef;

  invoice!: Invoice;
  invoiceId!: string;
  currentDate = new Date();

  constructor(
    private route: ActivatedRoute,
    private invoiceService: InvoiceService
  ) {}

  downloadInvoice() {
    console.log("Download Invoice!");
    this.invoiceService.downloadInvoice(this.invoice);
  }

  ngOnInit(): void {
    this.invoiceId = this.route.snapshot.paramMap.get('id')!;

    // Try from cache first
    const cached = localStorage.getItem(`invoice`);
    if (cached && JSON.parse(cached).invoice_id === this.invoiceId) {
      this.invoice = JSON.parse(cached);
    } else {
      // Then fetch fresh version from API
      this.invoiceService.getInvoiceById(this.invoiceId).subscribe({
        next: (data) => {
          this.invoice = data;
          localStorage.setItem(`invoice`, JSON.stringify(data));
        },
        error: (err) => console.error('Error loading invoice:', err),
      });
    }
  }

}
