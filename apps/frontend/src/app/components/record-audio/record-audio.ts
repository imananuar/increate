import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LoadingComponent } from '../loading/loading.component';
import { Invoice } from '../../model/invoice.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-record-audio',
  // imports: [LoadingComponent],
  templateUrl: './record-audio.html',
  styleUrl: './record-audio.css'
})
export class RecordAudioComponent implements OnDestroy {

//   private mediaRecorder?: MediaRecorder;
//   private chunks: BlobPart[] = [];
//   public audioURL?: string;
//   public isRecording = false;
//   private recordedBlob?: Blob;
//   public isLoading = false;

//   constructor(
//     private http: HttpClient, 
//     private ngZone: NgZone,
//     private router: Router
//   ) {}

//   async startRecording() {
//     try {
//       if (!this.isRecording) {
//         this.isRecording = true;
//         const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
//           ? 'audio/webm;codecs=opus'
//           : 'audio/mp4';
//         const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//         this.mediaRecorder = new MediaRecorder(stream, {mimeType});

//         this.mediaRecorder.ondataavailable = (e) => {
//           if (e.data.size > 0) this.chunks.push(e.data);
//         };
//         this.mediaRecorder.onstop = () => {
//           // 🧠 Run inside Angular zone so UI updates
//           this.ngZone.run(() => {
//             console.log('🎧 onstop fired!');
//             this.recordedBlob = new Blob(this.chunks, { type: mimeType });
//             this.audioURL = URL.createObjectURL(this.recordedBlob);
//             this.chunks = [];
//             console.log('✅ Audio ready:', this.audioURL);
//           });
//         };


//         this.mediaRecorder.start();
//         console.log('🎙️ Recording started');
//       }
//     } catch (err) {
//       console.error('Microphone access denied:', err);
//     }
//   }

//   stopRecording() {
//     if (this.mediaRecorder && this.isRecording) {
//       this.isRecording = false;
//       this.mediaRecorder.stop();
//       console.log('🛑 Recording stopped (waiting for onstop)');
//     }
//   }

//   uploadAudio() {
//     console.log(this.audioURL);
//     console.log(this.recordedBlob);
//     if (!this.recordedBlob) return;

//     const formData = new FormData();
//     formData.append('audio', this.recordedBlob, 'recording.webm');
//     this.isLoading = true;

//     this.http.post<Invoice>('http://localhost:3000/invoice/createFromAudio', formData)
//       .subscribe({
//         next: (res: Invoice) => {
//           this.isLoading = false;
//           console.log(`[InvoiceId ${res.invoice_id}] - Moving to invoice page`);
//           localStorage.setItem(`invoice`, JSON.stringify(res));
//           this.router.navigate(['/invoice', res.invoice_id]);
//         },
//         error: (err) => {
//           this.isLoading = false;
//           console.error('❌ Upload failed:', err)
//         }
//       });
//   }

 @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  Math = Math;
  isRecording = false;
  audioBlob: Blob | null = null;
  audioUrl: string | null = null;
  isPlaying = false;
  isSubmitting = false;
  isSuccess = false;
  recordingTime = 0;
  waveformData: number[] = Array(40).fill(0);

  private mediaRecorder: MediaRecorder | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private animationFrameId: number | null = null;
  private chunks: Blob[] = [];
  private timerInterval: any = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngOnDestroy(): void {
    this.cleanup();
  }

  async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // this.audioContext = new AudioContext();
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      const source = this.audioContext.createMediaStreamSource(stream);
      source.connect(this.analyser);
      this.analyser.fftSize = 128;

      this.mediaRecorder = new MediaRecorder(stream);
      this.chunks = [];

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          this.chunks.push(e.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        const mimeType = this.mediaRecorder?.mimeType || 'audio/mp4';
        this.ngZone.run(() => {
          this.audioBlob = new Blob(this.chunks, { type: mimeType });
          this.audioUrl = URL.createObjectURL(this.audioBlob);
          this.chunks = [];
          stream.getTracks().forEach(track => track.stop());
        })
      };

      // this.mediaRecorder.start();
      this.mediaRecorder.start(100);
      this.isRecording = true;
      this.recordingTime = 0;
      this.audioBlob = null;
      this.audioUrl = null;
      
      this.timerInterval = setInterval(() => {
        this.recordingTime++;
      }, 1000);

      this.animateWaveform();

    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Unable to access microphone. Please check permissions.');
    }
  }

  private animateWaveform(): void {
    if (!this.analyser) return;

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!this.isRecording) return;

      this.analyser!.getByteFrequencyData(dataArray);
      
      const bars = 40;
      const step = Math.floor(bufferLength / bars);
      const newWaveform: number[] = [];

      for (let i = 0; i < bars; i++) {
        const value = dataArray[i * step] / 255;
        newWaveform.push(value);
      }

      this.waveformData = newWaveform;
      this.animationFrameId = requestAnimationFrame(draw);
    };

    draw();
  }

  stopRecording(): void {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;

      console.log("Inside stop recording");
      
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
      }
      
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
      }
      
      if (this.audioContext) {
        this.audioContext.close();
      }
      
      this.waveformData = Array(40).fill(0);
    }
  }

  togglePlayback(): void {
    if (!this.audioPlayer?.nativeElement) return;

    const audio = this.audioPlayer.nativeElement;
    console.log(audio);
    console.log("memainkan");
    if (this.isPlaying) {
      audio.pause();
      this.isPlaying = false;
    } else {
      // Reset to beginning if ended
      if (audio.ended) {
        audio.currentTime = 0;
      }
      
      if (audio.readyState < 2) {
        audio.load();
      }
      
     const playPromise = audio.play();

      if (playPromise !== undefined) {
        console.log(playPromise);
        playPromise
          .then(() => {
            this.isPlaying = true;
          })
          .catch(error => {
            console.error('Playback error:', error);
            alert('Unable to play audio. The recording format may not be supported by your browser.');
            this.isPlaying = false;
          });
      }
    }
  }

  onAudioEnded(): void {
    this.isPlaying = false;
  }

  async handleSubmit(): Promise<void> {
    if (!this.audioBlob) return;

    this.isSubmitting = true;
    
    try {
      const formData = new FormData();
      formData.append('audio', this.audioBlob, 'recording.webm');

      await this.http.post('/api/your-endpoint', formData).toPromise();

      this.isSuccess = true;
      setTimeout(() => {
        this.router.navigate(['/next-page']);
      }, 1000);
    } catch (error) {
      console.error('Error submitting audio:', error);
      alert('Failed to submit audio. Please try again.');
    } finally {
      this.isSubmitting = false;
    }
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  private cleanup(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl);
    }
  }
  
}
