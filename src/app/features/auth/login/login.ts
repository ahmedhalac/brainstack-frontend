import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLinkWithHref } from '@angular/router';
import { AuthService, AuthError } from '../../../core/services/auth.service';
import { EMPTY, catchError, finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { LoginRequest } from '../../../models/auth/login.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  imports: [
    MatSlideToggleModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterLinkWithHref,
    NgxSpinnerModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);
  private spinner = inject(NgxSpinnerService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  loginForm = this.initializeForm();
  isLoading = signal(false);

  initializeForm(): FormGroup {
    return this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading()) {
      this.loginUser(this.loginForm.value);
    }
  }

  loginUser(formValue: LoginRequest): void {
    this.isLoading.set(true);
    this.spinner.show();

    this.authService
      .login(formValue)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error: AuthError) => {
          if (error.message === 'Please verify your email' && error.status === 403) {
            this.router.navigate(['/verify-email'], {
              queryParams: { email: this.loginForm.get('email')?.value },
            });
          } else {
            this.toastr.error(error.message);
          }

          return EMPTY;
        }),
        finalize(() => {
          this.isLoading.set(false);
          this.spinner.hide();
        })
      )
      .subscribe(() => {
        this.toastr.success('Login successful!');
        this.router.navigate(['/dashboard']);
      });
  }
}
