import { HttpClient } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';
import { LoadingComponent } from '../loading/loading.component';
import { Invoice } from '../../model/invoice.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-record-audio',
  imports: [LoadingComponent],
  templateUrl: './record-audio.html',
  styleUrl: './record-audio.css'
})
export class RecordAudioComponent {

  private mediaRecorder?: MediaRecorder;
  private chunks: BlobPart[] = [];
  public audioURL?: string;
  public isRecording = false;
  private recordedBlob?: Blob;
  public isLoading = false;

  constructor(
    private http: HttpClient, 
    private ngZone: NgZone,
    private router: Router
  ) {}

  async startRecording() {
    try {
      if (!this.isRecording) {
        this.isRecording = true;
        const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : 'audio/mp4';
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaRecorder = new MediaRecorder(stream, {mimeType});

        this.mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) this.chunks.push(e.data);
        };
        this.mediaRecorder.onstop = () => {
          // 🧠 Run inside Angular zone so UI updates
          this.ngZone.run(() => {
            console.log('🎧 onstop fired!');
            this.recordedBlob = new Blob(this.chunks, { type: mimeType });
            this.audioURL = URL.createObjectURL(this.recordedBlob);
            this.chunks = [];
            console.log('✅ Audio ready:', this.audioURL);
          });
        };


        this.mediaRecorder.start();
        console.log('🎙️ Recording started');
      }
    } catch (err) {
      console.error('Microphone access denied:', err);
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.isRecording = false;
      this.mediaRecorder.stop();
      console.log('🛑 Recording stopped (waiting for onstop)');
    }
  }

  uploadAudio() {
    console.log(this.audioURL);
    console.log(this.recordedBlob);
    if (!this.recordedBlob) return;

    const formData = new FormData();
    formData.append('audio', this.recordedBlob, 'recording.webm');
    this.isLoading = true;

    this.http.post<Invoice>('http://localhost:3000/invoice/createFromAudio', formData)
      .subscribe({
        next: (res: Invoice) => {
          this.isLoading = false;
          console.log(`[InvoiceId ${res.invoice_id}] - Moving to invoice page`);
          localStorage.setItem(`invoice`, JSON.stringify(res));
          this.router.navigate(['/invoice', res.invoice_id]);
        },
        error: (err) => {
          this.isLoading = false;
          console.error('❌ Upload failed:', err)
        }
      });
  }
  
}
