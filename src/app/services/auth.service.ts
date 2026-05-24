import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiService = inject(ApiService);
  private router = inject(Router);

  // Signal to track current user
  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);

  constructor() {
    // מריצים את הטעינה רק אם אנחנו נמצאים בדפדפן
    if (typeof window !== 'undefined' && window.localStorage) {
      this.loadCurrentUser();
    }
  }

  // Load current user from localStorage
  private loadCurrentUser(): void {
    const userJson = localStorage.getItem('currentUser');
    const token = localStorage.getItem('token');
    
    if (userJson && token) {
      try {
        this.currentUser.set(JSON.parse(userJson));
        this.isAuthenticated.set(true);
      } catch (error) {
        this.logout();
      }
    }
  }

  // Register new user - שמירה אוטומטית בעזרת tap
  register(request: RegisterRequest) {
    return this.apiService.post<AuthResponse>('/auth/register', request).pipe(
      tap(response => this.saveAuthResponse(response))
    );
  }

  // Login user - שמירה אוטומטית בעזרת tap
  login(request: LoginRequest) {
    return this.apiService.post<AuthResponse>('/auth/login', request).pipe(
      tap(response => this.saveAuthResponse(response))
    );
  }

  // Save auth response to storage and update signals
  saveAuthResponse(response: AuthResponse): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('currentUser', JSON.stringify(response.user));
    }
    this.currentUser.set(response.user);
    this.isAuthenticated.set(true);
  }

  // Logout user
  logout(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
    }
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  // Get current token
  getToken(): string | null {
    return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  }

  // Check if user is authenticated
  checkIsAuthenticated(): boolean {
    return this.isAuthenticated();
  }
}