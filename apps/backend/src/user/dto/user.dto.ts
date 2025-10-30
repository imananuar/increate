import { IsEmail, IsNumber, IsString } from "class-validator";

export class UserDto {
    @IsEmail()
    email: string;

    @IsString()
    first_name: string;

    @IsString()
    last_name: string;

    @IsString()
    company_name: string;

    @IsString()
    company_street_addr: string;

    @IsString()
    company_building_addr: string;

    @IsNumber()
    company_postcode: number;

    @IsString()
    company_city: string;

    @IsString()
    company_state: string;

    @IsString()
    company_country: string;
}