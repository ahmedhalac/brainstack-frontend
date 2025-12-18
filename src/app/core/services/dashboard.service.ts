import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthError } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getUsers(): Observable<any> {
    const url = `${this.baseUrl}/users`;
    return this.http.get<any>(url).pipe(
      catchError((error) => {
        const authError: AuthError = {
          message: error.error?.message || error.message || 'Cannot fetch users. Please try again.',
          status: error.status,
        };
        return throwError(() => authError);
      })
    );
  }
}
