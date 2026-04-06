import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly BASE = 'http://localhost:5263/api/Auth';
  private _isGuest = false;
  isLoggedIn$ = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient, private router: Router) {}

  signup(data: { Name: string; Email: string; Password: string; Role: string }) {
    return this.http.post(`${this.BASE}/signup`, data, { responseType: 'text' });
  }

  login(data: { email: string; password: string }) {
    return this.http.post<any>(`${this.BASE}/login`, data).pipe(
      tap(res => {
        console.log('Full login response:', JSON.stringify(res));
        const token = res.Token || res.token;
        console.log('Extracted token:', token);
        if (token) {
          localStorage.setItem('authToken', token);
          localStorage.removeItem('token');
        }
        this._isGuest = false;
        this.isLoggedIn$.next(true);
      })
    );
  }

  continueAsGuest() {
    this._isGuest = true;
    this.isLoggedIn$.next(true);
    this.router.navigate(['/dashboard']);
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    this._isGuest = false;
    this.isLoggedIn$.next(false);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken') || localStorage.getItem('token');
  }

  isGuest(): boolean {
    return this._isGuest;
  }

  isAuthenticated(): boolean {
    return this.hasToken() || this._isGuest;
  }

  private hasToken(): boolean {
    return !!(localStorage.getItem('authToken') || localStorage.getItem('token'));
  }
}
