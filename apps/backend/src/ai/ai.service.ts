import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import { promisify } from 'util';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { CONST_AI_MODEL } from 'src/constant/app.constants';
import { InvoiceDto } from 'src/invoice/dto/invoice.dto';
import { FfmpegService } from 'src/ffmpeg/ffmpeg.service';
import { WhisperService } from 'src/whisper/whisper.service';

// const execPromise = promisify(exec);

@Injectable()
export class AIService {
  private readonly openai: OpenAI;
  private readonly logger = new Logger("AIService");

  constructor(
    private configService: ConfigService,
    private ffmpegService: FfmpegService,
    private whisperService: WhisperService
  
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('XAI_API_KEY') || 'your_api_key', // Fallback for dev; prefer env vars
      baseURL: 'https://api.x.ai/v1',
      timeout: 360000, // 6-minute timeout for reasoning models
    });
  }

  async getOllamaResponse(model: string, systemRole: string, prompt: string): Promise<InvoiceDto | undefined> {
    let responseJson: InvoiceDto;
    let result = '';

    try {
      const response = await fetch(`${this.configService.get<string>('OLLAMA_URL')}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'system',
              content: systemRole
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      });
      const reader = response.body?.getReader();

      if (reader) {
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          // Each chunk is JSON like {"response":"Hello","done":false}
          const lines = chunk.trim().split('\n');
          for (const line of lines) {
            const data = JSON.parse(line);
            if (data.response) result += data.response;
          }
        }
      }

        responseJson = JSON.parse(result.replace(/```json/g, '').replace(/```/g, ''));
        responseJson.model = model;
        responseJson.token = 0;
        return responseJson;

    } catch (err) {
      this.logger.error("Error occured: ", err);
      this.logger.error(`Result: `, result);
    }
  }

  async getGrokResponse(systemRole: string, prompt: string): Promise<InvoiceDto | undefined> {
    try {
      const completion = await this.openai.chat.completions.create(
        {
          model: CONST_AI_MODEL.GROK,
          messages: [
            {
              role: 'system',
              content: systemRole,
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
        }
      );

      const response = completion.choices[0]?.message?.content;

      if (!response) {
        throw new InternalServerErrorException('No response received from Grok API');
      }

      const responseJson: InvoiceDto = JSON.parse(response.replace(/```json/g, '').replace(/```/g, ''));
      responseJson.token = completion.usage?.total_tokens;
      responseJson.model = CONST_AI_MODEL.GROK;
      return responseJson;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to fetch Grok response: ${error.message}`);
    }
  }

  async getWhisperTranscription(buffer: Buffer): Promise<string> {
    // const tmpDir = path.join(path.dirname, 'whisper-audio');
    const tmpDir = path.resolve(__dirname, '/media/transcription');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

    const webmPath = path.join(tmpDir, `temp-${Date.now()}.webm`);
    const wavPath = webmPath.replace('.webm', '.wav');
    const txtPath = wavPath.replace('.wav', '.txt');

    // Write the buffer temporarily
    fs.writeFileSync(webmPath, buffer);

    try {
      // Convert WebM → WAV
      // await execPromise(`ffmpeg -y -i "${webmPath}" -ar 16000 -ac 1 -c:a pcm_s16le "${wavPath}"`);
      const ffmpegOutputDir = await this.ffmpegService.convertAudioToWav(webmPath, wavPath);

      // Run Whisper on the WAV file
      // await execPromise(`whisper "${wavPath}" --model turbo --output_format txt --output_dir transcription`);
      const whisperRes = await this.whisperService.transcribe(ffmpegOutputDir);
      console.log(`Typeof whisperRes: ${typeof(whisperRes)}`);
      console.log(`WhisperRes: ${whisperRes.text}`)

      if (whisperRes.success) {
        console.log("are you coming here boy?")
        return whisperRes.text.trim();
      }
      return "";

    } catch (err) {
      console.error("There are some error occured, ", err);
      return "";

    } finally {
      // Cleanup temp files
      // [webmPath, wavPath, txtPath].forEach((f) => {
      //   if (fs.existsSync(f)) fs.unlinkSync(f);
      // });
    }
  }

}
