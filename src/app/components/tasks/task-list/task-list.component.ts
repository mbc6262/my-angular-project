import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../../../services';
import { Task, TaskStatus } from '../../../models';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="tasks-container">
      <div class="header">
        <h1>✅ משימות</h1>
        <button (click)="toggleForm()" class="add-btn">
          {{ showForm() ? 'ביטול' : '+ משימה חדשה' }}
        </button>
      </div>

      @if (showForm()) {
        <app-task-form
          [task]="selectedTask()"
          (submitted)="onTaskSubmitted()"
          (cancelled)="toggleForm()"
        ></app-task-form>
      }

      @if (isLoading()) {
        <div class="loading">טוען...</div>
      } @else if (tasks().length > 0) {
        <div class="tasks-view">
          <div class="kanban-board">
            @for (status of statuses; track status) {
              <div class="kanban-column">
                <div class="column-header">
                  <h3>{{ getStatusLabel(status) }}</h3>
                  <span class="count">{{ getTasksByStatus(status).length }}</span>
                </div>
                <div class="tasks-list">
                  @for (task of getTasksByStatus(status); track task.id) {
                    <div class="task-item" [class]="'priority-' + task.priority">
                      <div class="task-header">
                        <h4>{{ task.title }}</h4>
                        <div class="task-actions">
                          <button (click)="editTask(task)" class="edit-btn" title="עדכן">✏️</button>
                          <button (click)="deleteTask(task.id)" class="delete-btn" title="מחק">🗑️</button>
                        </div>
                      </div>
                      <p class="task-description">{{ task.description }}</p>
                      <div class="task-footer">
                        <span class="priority-badge">{{ task.priority }}</span>
                        <select
                          [value]="task.status"
                          (change)="updateTaskStatus(task.id, $event)"
                          class="status-select"
                        >
                          @for (s of statuses; track s) {
                            <option [value]="s">{{ getStatusLabel(s) }}</option>
                          }
                        </select>
                      </div>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      } @else {
        <div class="no-data">
          <p>אין משימות עדיין</p>
          <button (click)="toggleForm()">צור משימה חדשה</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .tasks-container {
      direction: rtl;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .header h1 {
      margin: 0;
      font-size: 28px;
      color: #333;
    }

    .add-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 5px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s;
    }

    .add-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }

    .kanban-board {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .kanban-column {
      background: #f8f9fa;
      border-radius: 10px;
      padding: 15px;
      min-height: 500px;
      display: flex;
      flex-direction: column;
    }

    .column-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #dee2e6;
    }

    .column-header h3 {
      margin: 0;
      color: #333;
      font-size: 16px;
      font-weight: 600;
    }

    .count {
      background: #667eea;
      color: white;
      padding: 2px 10px;
      border-radius: 15px;
      font-size: 12px;
      font-weight: 600;
    }

    .tasks-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      flex: 1;
    }

    .task-item {
      background: white;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border-right: 3px solid #667eea;
      transition: all 0.3s;
    }

    .task-item.priority-high {
      border-right-color: #dc3545;
    }

    .task-item.priority-medium {
      border-right-color: #ffc107;
    }

    .task-item.priority-low {
      border-right-color: #17a2b8;
    }

    .task-item:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
    }

    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
    }

    .task-item h4 {
      margin: 0;
      color: #333;
      font-size: 14px;
      font-weight: 600;
      flex: 1;
    }

    .delete-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 16px;
      transition: transform 0.2s;
    }

    .delete-btn:hover {
      transform: scale(1.2);
    }

    .task-description {
      margin: 0 0 10px 0;
      color: #666;
      font-size: 13px;
      line-height: 1.4;
    }

    .task-footer {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .priority-badge {
      font-size: 11px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 12px;
      background-color: #e7e5ff;
      color: #667eea;
      text-transform: uppercase;
    }

    .status-select {
      flex: 1;
      padding: 4px 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 12px;
      background-color: white;
      direction: rtl;
      cursor: pointer;
    }

    .status-select:focus {
      outline: none;
      border-color: #667eea;
    }

    .loading,
    .no-data {
      text-align: center;
      padding: 40px 20px;
      color: #999;
      font-size: 16px;
    }

    .no-data button {
      margin-top: 15px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      font-weight: 600;
    }

    .no-data button:hover {
      opacity: 0.9;
    }
  `]
})
export class TaskListComponent implements OnInit {
  private taskService = inject(TaskService);

  tasks = signal<Task[]>([]);
  selectedTask = signal<Task | undefined>(undefined);
  isLoading = signal(false);
  showForm = signal(false);
  statuses: TaskStatus[] = ['todo', 'in-progress', 'review', 'done'];
  private pendingEditTaskId: string | null = null;
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.pendingEditTaskId = params['editTaskId'] || null;
    });
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading.set(true);
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.applyPendingEditTask();
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.isLoading.set(false);
      }
    });
  }

  toggleForm(): void {
    this.selectedTask.set(undefined);
    this.showForm.update(val => !val);
  }

  onTaskSubmitted(): void {
    this.selectedTask.set(undefined);
    this.showForm.set(false);
    this.loadTasks();
  }

  getTasksByStatus(status: TaskStatus): Task[] {
    return this.tasks().filter(task => task.status === status);
  }

  getStatusLabel(status: TaskStatus): string {
    const labels: Record<TaskStatus, string> = {
      'todo': 'לביצוע',
      'in-progress': 'בביצוע',
      'review': 'בבדיקה',
      'done': 'בוצע'
    };
    return labels[status];
  }

  updateTaskStatus(taskId: string, event: Event): void {
    const status = (event.target as HTMLSelectElement).value as TaskStatus;
    this.taskService.updateTaskStatus(taskId, status).subscribe({
      next: () => this.loadTasks(),
      error: (error) => console.error('Error updating task status:', error)
    });
  }

  editTask(task: Task): void {
    this.selectedTask.set(task);
    this.showForm.set(true);
  }

  deleteTask(taskId: string): void {
    if (confirm('האם אתה בטוח שברצונך למחוק את המשימה?')) {
      this.taskService.deleteTask(taskId).subscribe({
        next: () => this.loadTasks(),
        error: (error) => console.error('Error deleting task:', error)
      });
    }
  }

  private applyPendingEditTask(): void {
    if (!this.pendingEditTaskId) {
      return;
    }

    const task = this.tasks().find(t => t.id === this.pendingEditTaskId);
    if (task) {
      this.selectedTask.set(task);
      this.showForm.set(true);
      this.pendingEditTaskId = null;
    }
  }
}
