import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FfmpegService {
    private readonly FFMPEG_URL: string;
    constructor(
        private configService: ConfigService,
        private readonly httpService: HttpService
    ){
        this.FFMPEG_URL = `${this.configService.get<string>('FFMPEG_URL') || "http://ffmpeg:9000"}`
    }

    async convertAudioToWav(inputPath, outputPath: string): Promise<string> {
    try {
        const response = await axios.post(
            `${this.FFMPEG_URL}/audio-to-wav`,
            { input: inputPath, output: outputPath },
            { timeout: 120000 }
        );
            return response.data.output;
        } catch (error) {
            throw new Error(`FFmpeg failed: ${error.response?.data?.error || error.message}`);
        }
    }
}
