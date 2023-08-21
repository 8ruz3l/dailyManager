import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenStorageService } from './token-storage.service';

interface Tokens {
  access_token: string;
  refresh_token: string;
}

type AuthResponse = {
  isLoginSuccess: true;
  access_token: string;
} | {
  isLoginSuccess: false;
  error: HttpErrorResponse;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loginUrl = `${environment.apiUrl}/login`;
  registerUrl = `${environment.apiUrl}/register`;
  refreshUrl = `${environment.apiUrl}/refresh`;

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService, private tokenStorage: TokenStorageService) { }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<Tokens>(this.loginUrl, {
      username,
      password
    }).pipe(
      map(response => {
        this.tokenStorage.saveTokens(response);
        return { isLoginSuccess: true, access_token: response.access_token } as const;
      }))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            console.error('Invalid Credentials');
          } else {
            console.error('Login failed:', error);
          }
          return of({ isLoginSuccess: false, error: error } as const);
        })
      );
  }

  register(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<Tokens>(this.registerUrl, {
      username,
      password
    }).pipe(
      map(response => {
        this.tokenStorage.saveTokens(response);
        return { isLoginSuccess: true, access_token: response.access_token } as const;
      }))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 409) {
            console.error('User already exists', error);
          } else {
            console.error('Registration failed:', error);
          }
          return of({ isLoginSuccess: false, error: error } as const);
        })
      );
  }

  logout() {
    this.tokenStorage.removeTokens();
  }

  isAuthenticated(): boolean {
    return !this.jwtHelper.isTokenExpired(this.tokenStorage.getAccessToken());;
  }

  refresh(): Observable<AuthResponse> {
    let refresh_token = this.tokenStorage.getRefreshToken();
    return this.http.post<{ access_token: string }>(this.refreshUrl, {
      refresh_token
    }).pipe(
      map(response => {
        this.tokenStorage.saveTokens(response);
        return { isLoginSuccess: true, access_token: response.access_token } as const;
      }))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            console.error('Login expired');
          } else {
            console.error('Refresh failed:', error);
          }
          return of({ isLoginSuccess: false, error: error } as const);
        })
      );
  }
}
