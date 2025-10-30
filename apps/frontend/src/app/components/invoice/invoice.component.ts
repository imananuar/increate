import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Invoice, UpdateInvoiceRequest } from '../../model/invoice.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { InvoiceService } from '../../services/invoice.service';
import { CommonModule, CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { CurrencySymbolPipe } from '../../pipes/currency-symbol-pipe';
import { ModalAuth } from '../ui/modal-auth/modal-auth';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../model/user.model';

@Component({
  selector: 'app-invoice',
  imports: [CommonModule, DatePipe, TitleCasePipe, RouterLink, CurrencySymbolPipe, ModalAuth, ReactiveFormsModule],
  templateUrl: './invoice.component.html'
})
export class InvoiceComponent implements OnInit {
  @ViewChild('invoiceSection') invoiceSection!: ElementRef;

  invoice!: Invoice;
  invoiceId!: string;
  activeTab: string = 'profile';
  currentDate = new Date();
  logoUrl = 'assets/logo.png';
  isEdit: boolean = false;
  isLogin: boolean = false;
  accessToken: string | null = "";
  invoiceForm: FormGroup;
  userForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private invoiceService: InvoiceService,
    private userService: UserService,
    private fb: FormBuilder,
    private ngZone: NgZone
  ) {
    this.invoiceForm = this.fb.group({});
    this.userForm = this.fb.group({})
  }

  ngOnInit(): void {
    this.invoiceId = this.route.snapshot.paramMap.get('id')!;

    // Try from cache first
    const cached = localStorage.getItem(`invoice`);
    if (cached && JSON.parse(cached).invoice_id === this.invoiceId) {
      this.invoice = JSON.parse(cached);
    } else {
      // If not exist then only fetch fresh version from API
      this.invoiceService.getInvoiceById(this.invoiceId).subscribe({
        next: (res: Invoice) => {
          this.invoice = res;
          localStorage.setItem(`invoice`, JSON.stringify(res));
        },
        error: (err) => console.error('Error loading invoice:', err),
      });
    }
    
    // Fill-in Invoice Form
    this.invoiceForm.addControl('invoice_id', this.fb.control(this.invoiceId));
    this.invoiceForm.addControl('invoice_no', this.fb.control(this.invoice.invoice_no));
    this.invoiceForm.addControl('customer_name', this.fb.control(this.invoice.customer_name));
    this.invoiceForm.addControl('customer_addr', this.fb.control(this.invoice.customer_address));

    const itemsArr: FormArray = this.fb.array([]);
    this.invoice.items.forEach(item => {
      itemsArr.push(
        this.fb.group({
          name: [item.name],
          description: [item.description],
          quantity: [item.quantity],
          price_per_unit: [item.price_per_unit],
          total_price: [item.total_price],
        })
      )
    })

    // Take user data:
    const userDetails = localStorage.getItem('user');
    this.accessToken = localStorage.getItem('access_token');

    // If user not exist but accessToken exist
    if (this.accessToken && !userDetails) {
      const currentUser = this.userService.getCurrentUser(this.accessToken).subscribe({
        next: (user: User) => {
          this.userForm.addControl('email', this.fb.control(user.email));
          this.userForm.addControl('first_name', this.fb.control(user.first_name));
          this.userForm.addControl('last_name', this.fb.control(user.last_name));
          this.userForm.addControl('company_name', this.fb.control(user.company_name));
          this.userForm.addControl('company_street_addr', this.fb.control(user.company_street_addr));
          this.userForm.addControl('company_building_addr', this.fb.control(user.company_building_addr));
          this.userForm.addControl('company_postcode', this.fb.control(user.company_postcode));
          this.userForm.addControl('company_city', this.fb.control(user.company_city));
          this.userForm.addControl('company_state', this.fb.control(user.company_state));
          this.userForm.addControl('company_country', this.fb.control(user.company_country));
        },
        error: (err) => {
          if (err.error.message.toLowerCase() === "token expired" ) {
            localStorage.removeItem('access_token');
          }
        }
      })
    } else {

    }
  }

  async saveEditedInvoice() {
    this.invoiceService.updateInvoice({ 
      user: this.userForm.value,
      invoice: this.invoiceForm.value 
    });
    this.isEdit = false;
  }

  downloadInvoice() {
    console.log("Download Invoice!");
    this.invoiceService.downloadInvoice(this.invoice);
  }

  handleLoginSuccess(user: User) {
    this.ngZone.run(() => {
      console.log("Rerendering")
      this.userForm.addControl('email', this.fb.control(user.email));
      this.userForm.addControl('first_name', this.fb.control(user.first_name));
      this.userForm.addControl('last_name', this.fb.control(user.last_name));
      this.userForm.addControl('company_name', this.fb.control(user.company_name));
      this.userForm.addControl('company_street_addr', this.fb.control(user.company_street_addr));
      this.userForm.addControl('company_building_addr', this.fb.control(user.company_building_addr));
      this.userForm.addControl('company_postcode', this.fb.control(user.company_postcode));
      this.userForm.addControl('company_city', this.fb.control(user.company_city));
      this.userForm.addControl('company_state', this.fb.control(user.company_state));
      this.userForm.addControl('company_country', this.fb.control(user.company_country));

      // this.isLogin = false;
      this.accessToken = localStorage.getItem("access_token");
    })
  }

}
