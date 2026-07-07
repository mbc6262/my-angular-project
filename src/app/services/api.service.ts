import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  
  // בסיס ה-API לשרת המקומי
  private readonly API_URL = 'http://localhost:3000/api';

  constructor() {}

  private buildUrl(endpoint: string): string {
    const normalizedEndpoint = endpoint.startsWith('/api')
      ? endpoint.replace(/^\/api/, '')
      : endpoint;

    return `${this.API_URL}${normalizedEndpoint.startsWith('/') ? normalizedEndpoint : `/${normalizedEndpoint}`}`;
  }

  // Generic GET request
  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(this.buildUrl(endpoint), {
      headers: this.getHeaders()
    });
  }

  // Generic POST request
  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(this.buildUrl(endpoint), data, {
      headers: this.getHeaders()
    });
  }

  // Generic PUT request
  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(this.buildUrl(endpoint), data, {
      headers: this.getHeaders()
    });
  }

  // Generic DELETE request
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(this.buildUrl(endpoint), {
      headers: this.getHeaders()
    });
  }

  // Get authorization headers
  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (typeof window !== 'undefined' && localStorage) {
      const token = localStorage.getItem('token');
      if (token && token !== 'null') {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }

    return headers;
  }
}