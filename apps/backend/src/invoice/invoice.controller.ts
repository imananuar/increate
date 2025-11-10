import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Logger, HttpException, HttpStatus, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { AIService } from 'src/ai/ai.service';
import { ConfigService } from '@nestjs/config';
import { CONST_AI_MODEL, CONST_AI_SYSTEM_ROLE, CONST_PROMPT } from 'src/constant/app.constants';
import { FileInterceptor } from '@nestjs/platform-express';
import { randomUUID } from 'crypto';
import { InvoiceDto, UpdateInvoiceReq } from './dto/invoice.dto';
import { UserService } from 'src/user/user.service';
import { UpdateResult } from 'typeorm';

@Controller('api/invoice')

export class InvoiceController {
    private readonly logger = new Logger("InvoiceController");

    constructor(
      private readonly invoiceService: InvoiceService,
      private readonly aiService: AIService,
      private readonly configService: ConfigService,
      private readonly userService: UserService
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
    console.log(`Transcription is: ${transcription}`);

    if (!transcription) {
      this.logger.error(`Transcription is empty! Whispr may not transcripting it. Please check if whisper-chan is alive or not`);
      return {};
    }
    
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

  @Post('updateInvoice')
  async updateInvoice(@Body() reqBody: UpdateInvoiceReq) {
    if (!reqBody.user || !reqBody.invoice) {
      return new BadRequestException('Missing Data');
    }
    
    if (this.userService.updateUser(reqBody.user) && this.invoiceService.updateInvoice(reqBody.invoice)) {
      return { status: "success" }
    }

    return new InternalServerErrorException("Some error occured during updating invoice");
  }
}
