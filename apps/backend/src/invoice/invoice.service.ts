import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Item } from './entities/item.entity';
import { Invoice } from './entities/invoice.entity';
import { InvoiceDto } from './dto/invoice.dto';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>
  ){}

  async saveInvoice(invoiceDto: InvoiceDto): Promise<InvoiceDto> {
    await this.invoiceRepository.insert(invoiceDto);
    invoiceDto.items.map(item => {
      item.invoice_id = invoiceDto.invoice_id;
    })
    await this.itemRepository.insert(invoiceDto.items)
    return invoiceDto
  }

  async findOne(id: string) {
    return await this.invoiceRepository.findOne({
      where: { invoice_id: id},
      relations: ['items']
    })
  }

   updateInvoice(invoiceDto: InvoiceDto): boolean {
    try {
      this.invoiceRepository.update({ invoice_id: invoiceDto.invoice_id}, {
        customer_name: invoiceDto.customer_name,
        customer_address: invoiceDto.customer_address,
        invoice_no: invoiceDto.invoice_no
      })
    } catch (err) {
      console.error("Some error occured during updating invoice, ", err);
    }
    return true;
  }
}
