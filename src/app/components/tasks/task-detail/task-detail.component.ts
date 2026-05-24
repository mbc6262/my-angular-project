import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TaskService } from '../../../services';
import { Task } from '../../../models';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isLoading()) {
      <div class="loading">טוען...</div>
    } @else if (task()) {
      <div class="task-detail-container">
        <div class="detail-header">
          <h1>{{ task()?.title }}</h1>
          <a routerLink="/tasks" class="back-link">← חזור</a>
        </div>

        <div class="detail-content">
          <div class="detail-section">
            <h3>תיאור</h3>
            <p>{{ task()?.description }}</p>
          </div>

          <div class="detail-grid">
            <div class="detail-field">
              <label>סטטוס</label>
              <span class="status-badge" [class]="'status-' + task()?.status">
                {{ task()?.status }}
              </span>
            </div>

            <div class="detail-field">
              <label>עדיפות</label>
              <span class="priority-badge" [class]="'priority-' + task()?.priority">
                {{ task()?.priority }}
              </span>
            </div>

            <div class="detail-field">
              <label>הוקצה ל:</label>
              <p>{{ task()?.assignedTo }}</p>
            </div>

            <div class="detail-field">
              <label>תאריך סיום</label>
              <p>{{ task()?.dueDate | date: 'dd/MM/yyyy' }}</p>
            </div>

            <div class="detail-field">
              <label>נוצר על ידי</label>
              <p>{{ task()?.createdBy }}</p>
            </div>

            <div class="detail-field">
              <label>תאריך יצירה</label>
              <p>{{ task()?.createdAt | date: 'dd/MM/yyyy HH:mm' }}</p>
            </div>
          </div>

          <div class="actions">
            <button class="edit-btn" (click)="editTask()">✏️ עדכן</button>
            <button class="delete-btn">🗑️ מחק</button>
          </div>
        </div>
      </div>
    } @else {
      <div class="not-found">
        <p>המשימה לא נמצאה</p>
        <a routerLink="/tasks">חזור לרשימת משימות</a>
      </div>
    }
  `,
  styles: [`
    .loading,
    .not-found {
      text-align: center;
      padding: 40px 20px;
      color: #999;
      font-size: 16px;
    }

    .not-found a {
      display: inline-block;
      margin-top: 15px;
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
    }

    .task-detail-container {
      direction: rtl;
    }

    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .detail-header h1 {
      margin: 0;
      font-size: 32px;
      color: #333;
    }

    .back-link {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
    }

    .back-link:hover {
      text-decoration: underline;
    }

    .detail-content {
      background: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .detail-section {
      margin-bottom: 30px;
    }

    .detail-section h3 {
      margin: 0 0 15px 0;
      color: #333;
      font-size: 18px;
    }

    .detail-section p {
      margin: 0;
      color: #666;
      line-height: 1.6;
      font-size: 15px;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .detail-field {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
    }

    .detail-field label {
      display: block;
      color: #666;
      font-weight: 600;
      font-size: 13px;
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    .detail-field p {
      margin: 0;
      color: #333;
      font-size: 15px;
    }

    .status-badge,
    .priority-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-done {
      background-color: #d4edda;
      color: #155724;
    }

    .status-in-progress {
      background-color: #cfe2ff;
      color: #084298;
    }

    .status-review {
      background-color: #fff3cd;
      color: #856404;
    }

    .status-todo {
      background-color: #e2e3e5;
      color: #383d41;
    }

    .priority-high {
      background-color: #ffe5e5;
      color: #d32f2f;
    }

    .priority-medium {
      background-color: #fff3cd;
      color: #f57f17;
    }

    .priority-low {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .actions {
      display: flex;
      gap: 15px;
      margin-top: 30px;
    }

    .edit-btn,
    .delete-btn {
      padding: 12px 24px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s;
    }

    .edit-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .edit-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }

    .delete-btn {
      background-color: #f8f9fa;
      color: #333;
      border: 1px solid #ddd;
    }

    .delete-btn:hover {
      background-color: #e0e0e0;
    }
  `]
})
export class TaskDetailComponent implements OnInit {
  private taskService = inject(TaskService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  task = signal<Task | null>(null);
  isLoading = signal(false);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const taskId = params['id'];
      if (taskId) {
        this.loadTask(taskId);
      }
    });
  }

  private loadTask(taskId: string): void {
    this.isLoading.set(true);
    this.taskService.getTaskById(taskId).subscribe({
      next: (task) => {
        this.task.set(task);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading task:', error);
        this.isLoading.set(false);
      }
    });
  }

  editTask(): void {
    if (this.task()) {
      this.router.navigate(['/tasks'], { queryParams: { editTaskId: this.task()!.id } });
    }
  }
}
