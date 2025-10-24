export interface Item {
    id?: string;
    invoice_id: string;
    name: string;
    description: string;
    quantity: number;
    price_per_unit: number;
    total_price: number;
    currency: string;
}