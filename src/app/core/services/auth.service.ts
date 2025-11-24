import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { LoginRequest } from '../../models/auth/login.model';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api/login';

  login(payload: LoginRequest): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(this.baseUrl, payload).pipe(
      tap((response) => {
        localStorage.setItem('token', response.accessToken);
      }),
      catchError((error) => {
        return throwError(() => new Error(error.err?.message || 'Login failed'));
      })
    );
  }
}
