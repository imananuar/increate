import { Controller, Post, Body } from '@nestjs/common';
import { AIService } from './ai.service';
import { CONST_AI_MODEL } from 'src/constant/app.constants';

@Controller('invoice')
export class AIController {
  constructor(private readonly AI_Service: AIService) {}

  // @Post('generate')
  // async generate(@Body('prompt') prompt: string) {
  //   const response = await this.AI_Service.get(CONST_AI_MODEL.DEEPSEEK_R1, prompt);
  //   return JSON.parse(response);
  // }
}
