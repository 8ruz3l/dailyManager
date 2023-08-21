import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.authService.isAuthenticated() 
        ? next.handle(request) 
        : refreshAccessToken(this.authService, request, next);
    }
}

function refreshAccessToken(authService: AuthService, request: HttpRequest<any>, next: HttpHandler) {
    return authService.refresh().pipe(
        switchMap((response) => {
            if (response.isLoginSuccess) {
                const newAccessToken = response.access_token;
                request = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${newAccessToken}`
                    }
                });
            }
            return next.handle(request);
        })
    );
}

