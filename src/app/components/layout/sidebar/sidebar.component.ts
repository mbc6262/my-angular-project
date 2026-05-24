import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside class="sidebar">
      <nav class="sidebar-nav">
        <ul class="nav-list">
          <li class="nav-item">
            <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">
              📊 דשבורד
            </a>
          </li>
          <li class="nav-item">
            <a routerLink="/teams" routerLinkActive="active" class="nav-link">
              👥 צוותים
            </a>
          </li>
          <li class="nav-item">
            <a routerLink="/projects" routerLinkActive="active" class="nav-link">
              📂 פרויקטים
            </a>
          </li>
          <li class="nav-item">
            <a routerLink="/tasks" routerLinkActive="active" class="nav-link">
              ✅ משימות
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 250px;
      background-color: #f8f9fa;
      border-right: 1px solid #dee2e6;
      min-height: calc(100vh - 70px);
      direction: rtl;
    }

    .sidebar-nav {
      padding: 20px 0;
    }

    .nav-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .nav-item {
      margin: 0;
    }

    .nav-link {
      display: block;
      padding: 15px 20px;
      color: #333;
      text-decoration: none;
      transition: all 0.3s;
      border-right: 3px solid transparent;
      font-weight: 500;
    }

    .nav-link:hover {
      background-color: #e9ecef;
      color: #667eea;
    }

    .nav-link.active {
      background-color: #e7e5ff;
      color: #667eea;
      border-right-color: #667eea;
    }
  `]
})
export class SidebarComponent {
  private router = inject(Router);
}
