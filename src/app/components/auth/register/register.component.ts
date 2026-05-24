import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="register-container">
      <div class="register-card">
        <h2>הרשמה</h2>
        
        @if (errorMessage()) {
          <div class="error-message">{{ errorMessage() }}</div>
        }

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="name">שם מלא</label>
            <input
              type="text"
              id="name"
              formControlName="name"
              placeholder="הכנס שם מלא"
              [class.error]="isFieldInvalid('name')"
            />
            @if (isFieldInvalid('name')) {
              <span class="error-text">שם נדרש</span>
            }
          </div>

          <div class="form-group">
            <label for="email">דוא"ל</label>
            <input
              type="email"
              id="email"
              formControlName="email"
              placeholder="הכנס כתובת דוא״ל"
              [class.error]="isFieldInvalid('email')"
            />
            @if (isFieldInvalid('email')) {
              <span class="error-text">דוא"ל חוקי נדרש</span>
            }
          </div>

          <div class="form-group">
            <label for="password">ססמה</label>
            <input
              type="password"
              id="password"
              formControlName="password"
              placeholder="הכנס ססמה"
              [class.error]="isFieldInvalid('password')"
            />
            @if (isFieldInvalid('password')) {
              <span class="error-text">ססמה בת 6 תווים לפחות</span>
            }
          </div>

          <button
            type="submit"
            [disabled]="registerForm.invalid || isLoading()"
            class="submit-btn"
          >
            {{ isLoading() ? 'נרשם...' : 'הרשם' }}
          </button>
        </form>

        <p class="login-link">
          כבר יש לך חשבון?
          <a routerLink="/login">התחבר כאן</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .register-card {
      background: white;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      width: 100%;
      max-width: 400px;
    }

    h2 {
      text-align: center;
      color: #333;
      margin-bottom: 30px;
      direction: rtl;
    }

    .form-group {
      margin-bottom: 20px;
      direction: rtl;
    }

    label {
      display: block;
      margin-bottom: 8px;
      color: #555;
      font-weight: 500;
    }

    input {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 14px;
      transition: border-color 0.3s;
      box-sizing: border-box;
    }

    input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 5px rgba(102, 126, 234, 0.3);
    }

    input.error {
      border-color: #dc3545;
    }

    .error-text {
      color: #dc3545;
      font-size: 12px;
      margin-top: 5px;
      display: block;
    }

    .error-message {
      background-color: #f8d7da;
      color: #721c24;
      padding: 12px;
      border-radius: 5px;
      margin-bottom: 20px;
      border: 1px solid #f5c6cb;
      direction: rtl;
    }

    .submit-btn {
      width: 100%;
      padding: 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 5px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }

    .submit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .login-link {
      text-align: center;
      margin-top: 20px;
      color: #666;
      direction: rtl;
    }

    .login-link a {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
    }

    .login-link a:hover {
      text-decoration: underline;
    }
  `]
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  registerForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor() {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid && !this.isLoading()) {
      this.isLoading.set(true);
      this.errorMessage.set(null);

      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          // המידע נשמר אוטומטית בזכות ה-tap ב-AuthService, עוברים ישר פנימה
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading.set(false);
          
          // טיפול חכם בשגיאות (כמו מייל כפול 409)
          if (error.status === 409) {
            this.errorMessage.set('כתובת הדוא"ל הזו כבר רשומה במערכת.');
          } else {
            this.errorMessage.set(error.error?.error || 'שגיאה בהרשמה, נסה שוב מאוחר יותר.');
          }
        }
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}