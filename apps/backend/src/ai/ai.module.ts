import { Module } from "@nestjs/common";
import { AIService } from "./ai.service";
import { AIController } from "./ai.controller";
import { FfmpegService } from "src/ffmpeg/ffmpeg.service";
import { HttpModule, HttpService } from "@nestjs/axios";
import { WhisperService } from "src/whisper/whisper.service";

@Module({
    imports: [HttpModule],
    providers: [AIService, FfmpegService, WhisperService],
    controllers: [AIController],
    exports: [AIService]
})

export class AIModule {}