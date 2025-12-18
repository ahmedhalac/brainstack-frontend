import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLinkWithHref } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService, AuthError } from '../../../core/services/auth.service';
import { EMPTY, catchError, finalize } from 'rxjs';
import { RegisterRequest } from '../../../models/auth/register.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-register',
  imports: [
    MatSlideToggleModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterLinkWithHref,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);
  private spinner = inject(NgxSpinnerService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  registerForm = this.initializeForm();
  isLoading = signal(false);

  initializeForm(): FormGroup {
    return this.formBuilder.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid && !this.isLoading()) {
      this.registerUser(this.registerForm.value);
    }
  }

  registerUser(formValue: RegisterRequest): void {
    this.isLoading.set(true);
    this.spinner.show();

    this.authService
      .register(formValue)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error: AuthError) => {
          this.toastr.error(error.message);
          return EMPTY;
        }),
        finalize(() => {
          this.isLoading.set(false);
          this.spinner.hide();
        })
      )
      .subscribe(() => {
        this.toastr.success('Registration successful! Please verify your email.');
        this.router.navigate(['/verify-email'], { queryParams: { email: formValue?.email } });
      });
  }
}
