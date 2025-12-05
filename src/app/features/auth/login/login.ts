import { Component, OnDestroy, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLinkWithHref } from '@angular/router';
import { AuthService, AuthError } from '../../../core/services/auth.service';
import { EMPTY, Subject, catchError, finalize, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { LoginRequest } from '../../../models/auth/login.model';

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
export class Login implements OnDestroy {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);
  private spinner = inject(NgxSpinnerService);
  private router = inject(Router);

  loginForm = this.initializeForm();

  private destroy$ = new Subject<void>();
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
        takeUntil(this.destroy$),
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
