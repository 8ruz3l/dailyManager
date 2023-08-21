import { Injectable } from '@angular/core';
import { Tokens } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  saveTokens(tokens: Tokens): void {
    if (tokens.access) {
      localStorage.setItem('access_token', tokens.access);
    }
    if (tokens.refresh) {
      localStorage.setItem('refresh_token', tokens.refresh);
    }
  }

  removeTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }
}
