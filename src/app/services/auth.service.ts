import { Injectable, signal } from '@angular/core';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
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
  isAuthenticated = signal<boolean>(false); // מתחילים ב-false כברירת מחדל בשרת

  constructor() {
    // מריצים את הטעינה רק אם אנחנו נמצאים בדפדפן
    if (typeof window !== 'undefined' && window.localStorage) {
      this.loadCurrentUser();
      this.isAuthenticated.set(this.hasToken());
    }
  }

  // Load current user from localStorage
  private loadCurrentUser(): void {
    if (typeof window === 'undefined' || !window.localStorage) return;

    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      try {
        this.currentUser.set(JSON.parse(userJson));
        this.isAuthenticated.set(true);
      } catch (error) {
        this.logout();
      }
    }
  }

  // Register new user
  register(request: RegisterRequest) {
    return this.apiService.post<AuthResponse>('/auth/register', request);
  }

  // Login user
  login(request: LoginRequest) {
    return this.apiService.post<AuthResponse>('/auth/login', request);
  }
  // Save auth response
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

  // Check if user has token
  private hasToken(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  // Get current token
  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('token');
    }
    return null;
  }

  // Check if user is authenticated
  checkIsAuthenticated(): boolean {
    return this.isAuthenticated();
  }
}