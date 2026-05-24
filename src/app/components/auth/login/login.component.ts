import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router'; // <--- וודאי ש-RouterLink נמצא כאן!
import { AuthService } from '../../../services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>התחברות</h2>
        
        @if (errorMessage()) {
          <div class="error-message">{{ errorMessage() }}</div>
        }

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
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
              <span class="error-text">ססמה נדרשת</span>
            }
          </div>

          <button
            type="submit"
            [disabled]="loginForm.invalid || isLoading()"
            class="submit-btn"
          >
            {{ isLoading() ? 'מתחבר...' : 'התחבר' }}
          </button>
        </form>

        <p class="register-link">
          אין לך חשבון?
          <a routerLink="/register">הירשם כאן</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .login-card {
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

    .register-link {
      text-align: center;
      margin-top: 20px;
      color: #666;
      direction: rtl;
    }

    .register-link a {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
    }

    .register-link a:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  loginForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(null);

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.authService.saveAuthResponse(response);
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
          this.router.navigate([returnUrl]);
        },
        error: (error) => {
          this.isLoading.set(false);
          this.errorMessage.set(error.error?.message || 'שגיאה בהתחברות');
        }
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
