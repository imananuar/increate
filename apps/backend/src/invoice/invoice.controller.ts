import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Logger } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { AIService } from 'src/ai/ai.service';
import { ConfigService } from '@nestjs/config';
import { CONST_AI_MODEL, CONST_AI_SYSTEM_ROLE, CONST_PROMPT } from 'src/constant/app.constants';
import { FileInterceptor } from '@nestjs/platform-express';
import { randomUUID } from 'crypto';
import { InvoiceDto } from './dto/invoice.dto';

@Controller('api/invoice')

export class InvoiceController {
    private readonly logger = new Logger("InvoiceController");

    constructor(
      private readonly invoiceService: InvoiceService,
      private readonly aiService: AIService,
      private readonly configService: ConfigService,
    ) {}

  @Post('createFromAudio')
  @UseInterceptors(FileInterceptor('audio'))
  async createInvoiceFromAudio(@UploadedFile() file: Express.Multer.File) {
    let response: InvoiceDto | undefined, model: string;
    const invoiceId = randomUUID();

    const start = performance.now();
    const env = this.configService.get<string>("NODE_ENV");

    this.logger.log(`[InvoiceId ${invoiceId}] - Creating Invoice. Working hard! Environment: ${env}`);
    const transcription = await this.aiService.getWhisperTranscription(file.buffer);
    const prompt = `${CONST_PROMPT.CREATE_INVOICE_JSON} ${transcription}`

    if (env === "staging") {
        model = CONST_AI_MODEL.GROK
        response = await this.aiService.getGrokResponse(CONST_AI_SYSTEM_ROLE.CLERK, prompt);
    } else {
        model = CONST_AI_MODEL.DEEPSEEK_R1
        response = await this.aiService.getOllamaResponse(model, CONST_AI_SYSTEM_ROLE.CLERK, transcription);
    }

    const end = performance.now();
    this.logger.log(`[InvoiceId ${invoiceId}] - Processing time: ${((end - start) / 1000).toFixed(2)}s`);


    if (!response) {
        this.logger.error(`[InvoiceId ${invoiceId}] - Empty response from ${model}`);
        this.logger.warn(`If you call ollama, it might be not running.`);
        this.logger.warn(`If you call LLM API, please check your API Key.`);
        return {error: "Empty response!"};
    }

    this.logger.log(`[InvoiceId ${invoiceId}] - ${model} works great. Total_token [${response.token}]`);
    try {
        response.invoice_id = invoiceId;
        response.invoice_no = "ABSH-0000001";
        response.created_by = "Iman Anuar";
        const totalPrice = response.items.reduce((sum, item) => sum + parseFloat(parseFloat(item.total_price).toFixed(2)), 0);
        response.total_price = parseFloat(totalPrice.toFixed(2)).toString();

        this.invoiceService.saveInvoice(response);
        this.logger.log(`[InvoiceId ${invoiceId}] - Successfully created items and invoices in DB`);
        return response;
    } catch (err) {
        this.logger.error('Some error occured: ', err);
        return {};
    }
  }

  @Get('getInvoiceById/:id')
  findOne(@Param('id') invoiceId: string) {
    return this.invoiceService.findOne(invoiceId);
  }

  // @Post()
  // create(@Body() createInvoiceDto: CreateInvoiceDto) {
  //   return this.invoiceService.createItem(createInvoiceDto);
  // }

  // @Get()
  // findAll() {
  //   return this.invoiceService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.invoiceService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateInvoiceDto: UpdateInvoiceDto) {
  //   return this.invoiceService.update(+id, updateInvoiceDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.invoiceService.remove(+id);
  // }
}
