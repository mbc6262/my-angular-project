import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  
  // התיקון: הוספנו את /api בסוף הכתובת כדי שכל הבקשות יופנו לנתיב הנכון בשרת
  private readonly API_URL = 'http://localhost:3000/api';

  constructor() {}

  // Generic GET request
  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.API_URL}${endpoint}`, {
      headers: this.getHeaders()
    });
  }

  // Generic POST request
  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.API_URL}${endpoint}`, data, {
      headers: this.getHeaders()
    });
  }

  // Generic PUT request
  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.API_URL}${endpoint}`, data, {
      headers: this.getHeaders()
    });
  }

  // Generic DELETE request
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.API_URL}${endpoint}`, {
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