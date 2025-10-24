import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  // async createItem(invoiceDto: InvoiceDto): Promise<InvoiceDto> {
  //   invoiceDto.items.map(item => {
  //     item.invoice_id = invoiceDto.invoice_id;
  //   })

  //   await this.itemRepository.insert(invoiceDto.items);
  //   return invoiceDto;
  // }

  async saveInvoice(invoiceDto: InvoiceDto): Promise<InvoiceDto> {
    await this.invoiceRepository.insert(invoiceDto);
    invoiceDto.items.map(item => {
      item.invoice_id = invoiceDto.invoice_id;
    })
    await this.itemRepository.insert(invoiceDto.items)
    return invoiceDto
  }

  // findAll() {
  //   return `This action returns all invoice`;
  // }

  async findOne(id: string) {
    return await this.invoiceRepository.findOne({
      where: { invoice_id: id},
      relations: ['items']
    })
  }

  // update(id: number, updateInvoiceDto: UpdateInvoiceDto) {
  //   return `This action updates a #${id} invoice`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} invoice`;
  // }
}
