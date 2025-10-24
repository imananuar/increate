import { IsAlpha, IsAlphanumeric, IsNumber, IsString } from "class-validator";

export class ItemDto {
    @IsString()
    id: string;

    @IsAlphanumeric()
    invoice_id: string;

    @IsString()
    name: string;

    @IsNumber()
    quantity: number;

    @IsNumber()
    price_per_unit: string;

    @IsNumber()
    total_price: string;

    @IsString()
    currency: string;
}