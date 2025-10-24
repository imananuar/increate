import { InvoiceDto } from "src/invoice/dto/invoice.dto";

export const CONST_AI_MODEL = {
    DEEPSEEK_R1: "deepseek-r1:latest",
    GROK: "grok-4-fast"
} as const;

export const CONST_PROMPT = {
    CREATE_INVOICE_JSON: `
    Objective: From the transcription, give me response in JSON format:
    JSON = {
        customer_name: "",
        customer_address: "",
        items: [
            {name: "", description: "", price_per_unit:0, quantity: 0, total_price: 0, currency: "string"}
        ]
    }.
    Please take note on few things before you proceed:
    1) For the name part, sometimes it might be spell out. Take note the correct spelling.
    2) For the address part, make sure its in this format: "House number / unit no, building name, street name, postcode, city, state."
    3) Fill in the json with the following info and ONLY GIVE ME JSON AS AN OUTPUT WITHOUT NOTHING ELSE YOU MORON.
    4) If you fail to get any of the information just left it blank
    5) Every price is in MYR unless it is stated otherwise.

    Transcription: 
`
} as const;

export const CONST_AI_SYSTEM_ROLE = {
    CLERK: "You are The Most Detailed Clerk, a highly intelligent and helpful AI assistant which do your work in highly attentive and accurate manner"
    
}