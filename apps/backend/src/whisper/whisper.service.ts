import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class WhisperService {
    private readonly WHISPER_URL: string;
    constructor(
        private configService: ConfigService,
        private readonly httpService: HttpService
    ){
        this.WHISPER_URL = `${this.configService.get<string>('WHISPER_URL') || "http://ffmpeg:9001"}`
    }

    async transcribe(audio_path: string) {
    try {
        const response = await axios.post(
            `${this.WHISPER_URL}/transcribe`,
            { audio_path: audio_path},
            { timeout: 120000 }
        );
            console.log(`Response inside the service`);
            console.log(response.data);
            return response.data;
        } catch (error) {
            throw new Error(`FFmpeg failed: ${error.response?.data?.error || error.message}`);
        }
    }
}
