import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { LoginRequest, LoginResponse } from '../../models/auth/login.model';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { RegisterRequest, RegisterResponse } from '../../models/auth/register.model';
import { environment } from '../../../environments/environment';

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
    const url = `${this.baseUrl}/login`;
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
    const url = `${this.baseUrl}/register`;
    return this.http.post<RegisterResponse>(url, payload).pipe(
      catchError((error) => {
        const authError: AuthError = {
          message: error.error?.message || error.message || 'Registration failed. Please try again.',
          status: error.status,
        };
        return throwError(() => authError);
      })
    );
  }
}
