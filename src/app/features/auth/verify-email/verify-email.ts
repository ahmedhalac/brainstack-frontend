import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute, Router, RouterLinkWithHref } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { VerifyEmailRequest, VerifyEmailResponse } from '../../../models/auth/verify-email.model';
import { AuthError, AuthService } from '../../../core/services/auth.service';
import { EMPTY, Subject, catchError, finalize, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-verify-email',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterLinkWithHref,
    NgxSpinnerModule,
  ],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.scss',
})
export class VerifyEmail implements OnInit {
  private formBuilder = inject(FormBuilder);
  private spinner = inject(NgxSpinnerService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);

  isLoading = signal(false);
  isResending = signal(false);
  email: string | null = null;

  private destroy$ = new Subject<void>();
  verifyEmailForm = this.initializeForm();

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParamMap.get('email');
  }

  initializeForm(): FormGroup {
    return this.formBuilder.group({
      verificationCode: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(6),
          Validators.pattern(/^\d+$/),
        ],
      ],
    });
  }

  onSubmit(): void {
    if (this.verifyEmailForm.valid && !this.isLoading()) {
      if (this.email) {
        this.verifyEmail(this.email, this.verifyEmailForm.get('verificationCode')?.value);
      }
    }
  }

  verifyEmail(email: string, code: string): void {
    this.isLoading.set(true);
    this.spinner.show();
    console.log(code);

    this.authService
      .verifyEmail({ email, verificationCode: code })
      .pipe(
        takeUntil(this.destroy$),
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
        this.toastr.success('Email verified successfully');
        this.router.navigate(['/login']);
      });
  }

  resendCode(): void {
    this.isResending.set(true);
    this.spinner.show();

    if (this.email) {
      this.authService
        .resendCode({ email: this.email })
        .pipe(
          takeUntil(this.destroy$),
          catchError((error: AuthError) => {
            this.toastr.error(error.message);
            return EMPTY;
          }),
          finalize(() => {
            this.isResending.set(false);
            this.spinner.hide();
          })
        )
        .subscribe(() => {
          this.toastr.success('Code sent successfully. Please check your inbox');
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
