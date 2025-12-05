import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { LoginRequest, LoginResponse } from '../../models/auth/login.model';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { RegisterRequest, RegisterResponse } from '../../models/auth/register.model';
import { environment } from '../../../environments/environment';
import {
  ResendCodeRequest,
  ResendCodeResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
} from '../../models/auth/verify-email.model';

export interface AuthError {
  message: string;
  status?: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  login(payload: LoginRequest): Observable<LoginResponse> {
    const url = `${this.baseUrl}/auth/login`;
    return this.http.post<LoginResponse>(url, payload).pipe(
      tap((response) => {
        localStorage.setItem('token', response.accessToken);
      }),
      catchError((error) => {
        const authError: AuthError = {
          message: error.error?.message || error.message || 'Login failed. Please try again.',
          status: error.status,
        };
        return throwError(() => authError);
      })
    );
  }

  register(payload: RegisterRequest): Observable<RegisterResponse> {
    const url = `${this.baseUrl}/auth/register`;
    return this.http.post<RegisterResponse>(url, payload).pipe(
      catchError((error) => {
        const authError: AuthError = {
          message:
            error.error?.message || error.message || 'Registration failed. Please try again.',
          status: error.status,
        };
        return throwError(() => authError);
      })
    );
  }

  verifyEmail(payload: VerifyEmailRequest): Observable<VerifyEmailResponse> {
    const url = `${this.baseUrl}/auth/verify-email`;
    return this.http.post<VerifyEmailResponse>(url, payload).pipe(
      catchError((error) => {
        const authError: AuthError = {
          message:
            error.error?.message ||
            error.message ||
            'Verification of email failed. Please try again.',
          status: error.status,
        };
        return throwError(() => authError);
      })
    );
  }

  resendCode(payload: ResendCodeRequest): Observable<ResendCodeResponse> {
    const url = `${this.baseUrl}/auth/resend-code`;
    return this.http.post<ResendCodeResponse>(url, payload).pipe(
      catchError((error) => {
        const authError: AuthError = {
          message:
            error.error?.message || error.message || 'Resending code failed. Please try again.',
          status: error.status,
        };
        return throwError(() => authError);
      })
    );
  }
}
