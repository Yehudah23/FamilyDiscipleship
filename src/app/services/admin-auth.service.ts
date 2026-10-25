import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { ADMIN_API_BASE_URL } from './admin-api.config';

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  private readonly sessionUrl = `${ADMIN_API_BASE_URL}/admin/session`;

  constructor(private http: HttpClient) {}

  login(password: string): Observable<void> {
    return this.http.post<void>(
      `${ADMIN_API_BASE_URL}/admin/login`,
      { password },
      { withCredentials: true }
    );
  }

  checkSession(): Observable<boolean> {
    return this.http.get<void>(this.sessionUrl, { withCredentials: true }).pipe(
      map(() => true),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          return of(false);
        }
        return throwError(() => error);
      })
    );
  }

  logout(): Observable<void> {
    return this.http.delete<void>(this.sessionUrl, { withCredentials: true });
  }
}
