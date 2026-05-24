import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="navbar">
      <div class="navbar-container">
        <div class="navbar-brand">
          <h1>📋 ניהול משימות</h1>
        </div>

        <div class="navbar-menu">
          @if (authService.isAuthenticated()) {
            <div class="user-info">
              <span class="user-name">{{ authService.currentUser()?.name }}</span>
              <button (click)="logout()" class="logout-btn">התנתק</button>
            </div>
          }
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 15px 0;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      direction: rtl;
    }

    .navbar-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .navbar-brand h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }

    .navbar-menu {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .user-name {
      font-weight: 500;
    }

    .logout-btn {
      background-color: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid white;
      padding: 8px 16px;
      border-radius: 5px;
      cursor: pointer;
      transition: all 0.3s;
      font-weight: 500;
    }

    .logout-btn:hover {
      background-color: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
    }
  `]
})
export class NavbarComponent {
  authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}
