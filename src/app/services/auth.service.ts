import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

const API_BASE = 'https://pokeapp-ionic-production.up.railway.app';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = `${API_BASE}/auth`;

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { email: string, password: string }) {
    return this.http.post<{ token: string, id: string }>(`${this.baseUrl}/login`, credentials);
  }

  register(data: { username: string, email: string, password: string, gender: string }) {
    return this.http.post<{ message: string }>(`${this.baseUrl}/register`, data);
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
