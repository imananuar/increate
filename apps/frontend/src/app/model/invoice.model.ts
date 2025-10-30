import { Item } from "./item.model";
import { User } from "./user.model";

export interface Invoice {
    invoice_id: string;
    invoice_no: string;
    created_by: string;
    created_at: Date;
    updated_at: Date;
    customer_name: string;
    customer_address: string;
    total_price: string;
    token: number | undefined;
    model: string;
    items: Item[];
}

export interface UpdateInvoiceRequest {
    user: User
    invoice: Invoice
}