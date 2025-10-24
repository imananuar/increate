import { IsDate, IsNumber, IsString } from "class-validator";
import { ItemDto } from "./item.dto";

export class InvoiceDto {
    
    @IsString()
    invoice_id: string;

    @IsString()
    invoice_no: string;

    @IsString()
    created_by: string;

    @IsString()
    customer_name: string;

    @IsString()
    customer_address: string;

    @IsString()
    total_price: string;

    @IsNumber()
    token: number | undefined;

    @IsString()
    model: string;
    
    items: ItemDto[];
}