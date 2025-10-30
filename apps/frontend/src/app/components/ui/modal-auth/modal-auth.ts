import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../model/user.model';
import { AuthResponse } from '../../../model/auth.model';

@Component({
  selector: 'app-modal-auth',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-auth.html'
})
export class ModalAuth {
  @Input() isOpen = true;
  @Output() close = new EventEmitter<boolean>();
  @Output() loginSuccess = new EventEmitter<User>();

  loginForm: FormGroup;
  errorMessage: string = "";

  activeTab: 'login' | 'register' = 'login';
  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['']
    })
  }

  login() {
    this.authService.login(this.loginForm.value).subscribe({
      next: (res: AuthResponse) => {
        this.errorMessage = "";
        this.isOpen = false;
        this.loginSuccess.emit(res.user);
        this.close.emit();
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = error.message;
      }
    })
  }

  register() {

  }
}
