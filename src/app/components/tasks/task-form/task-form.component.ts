import { Component, ChangeDetectionStrategy, signal, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService, ProjectService } from '../../../services';
import { Task, Project } from '../../../models';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="form-container">
      <h2>{{ task()?.id ? 'עדכון משימה' : 'משימה חדשה' }}</h2>
      
      @if (errorMessage()) {
        <div class="error-message">{{ errorMessage() }}</div>
      }

      <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
        <div class="form-row">
          <div class="form-group">
            <label for="projectId">פרויקט</label>
            <select
              id="projectId"
              formControlName="projectId"
              [class.error]="isFieldInvalid('projectId')"
            >
              <option value="">בחר פרויקט</option>
              @for (project of projects(); track project.id) {
                <option [value]="project.id">{{ project.name }}</option>
              }
            </select>
            @if (isFieldInvalid('projectId')) {
              <span class="error-text">פרויקט נדרש</span>
            }
          </div>

          <div class="form-group">
            <label for="priority">עדיפות</label>
            <select
              id="priority"
              formControlName="priority"
              [class.error]="isFieldInvalid('priority')"
            >
              <option value="">בחר עדיפות</option>
              <option value="low">נמוכה</option>
              <option value="medium">בינונית</option>
              <option value="high">גבוהה</option>
            </select>
            @if (isFieldInvalid('priority')) {
              <span class="error-text">עדיפות נדרשת</span>
            }
          </div>
        </div>

        <div class="form-group">
          <label for="title">כותרת המשימה</label>
          <input
            type="text"
            id="title"
            formControlName="title"
            placeholder="הכנס כותרת משימה"
            [class.error]="isFieldInvalid('title')"
          />
          @if (isFieldInvalid('title')) {
            <span class="error-text">כותרת נדרשת</span>
          }
        </div>

        <div class="form-group">
          <label for="description">תיאור</label>
          <textarea
            id="description"
            formControlName="description"
            placeholder="תיאור המשימה"
            rows="4"
            [class.error]="isFieldInvalid('description')"
          ></textarea>
          @if (isFieldInvalid('description')) {
            <span class="error-text">תיאור נדרש</span>
          }
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="assignedTo">הקצה ל:</label>
            <input
              type="email"
              id="assignedTo"
              formControlName="assignedTo"
              placeholder="כתובת דוא״ל של המשתמש"
              [class.error]="isFieldInvalid('assignedTo')"
            />
            @if (isFieldInvalid('assignedTo')) {
              <span class="error-text">דוא"ל נדרש</span>
            }
          </div>

          <div class="form-group">
            <label for="dueDate">תאריך סיום</label>
            <input
              type="date"
              id="dueDate"
              formControlName="dueDate"
              [class.error]="isFieldInvalid('dueDate')"
            />
            @if (isFieldInvalid('dueDate')) {
              <span class="error-text">תאריך נדרש</span>
            }
          </div>
        </div>

        <div class="form-actions">
          <button
            type="submit"
            [disabled]="taskForm.invalid || isLoading()"
            class="submit-btn"
          >
            {{ isLoading() ? 'שומר...' : 'שמור' }}
          </button>
          <button type="button" (click)="onCancel()" class="cancel-btn">
            ביטול
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .form-container {
      background: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      direction: rtl;
    }

    h2 {
      margin: 0 0 25px 0;
      color: #333;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      margin-bottom: 8px;
      color: #555;
      font-weight: 500;
    }

    input,
    textarea,
    select {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 14px;
      font-family: inherit;
      box-sizing: border-box;
      direction: rtl;
      transition: border-color 0.3s;
    }

    input:focus,
    textarea:focus,
    select:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 5px rgba(102, 126, 234, 0.3);
    }

    input.error,
    textarea.error,
    select.error {
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
    }

    .form-actions {
      display: flex;
      gap: 10px;
      margin-top: 25px;
      justify-content: flex-start;
    }

    .submit-btn,
    .cancel-btn {
      padding: 12px 24px;
      border: none;
      border-radius: 5px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .submit-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }

    .submit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .cancel-btn {
      background-color: #f0f0f0;
      color: #333;
    }

    .cancel-btn:hover {
      background-color: #e0e0e0;
    }
  `]
})
export class TaskFormComponent {
  private taskService = inject(TaskService);
  private projectService = inject(ProjectService);
  private fb = inject(FormBuilder);

  task = input<Task | undefined>();
  projects = signal<Project[]>([]);
  submitted = output<void>();
  cancelled = output<void>();

  taskForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor() {
    this.taskForm = this.fb.group({
      projectId: ['', [Validators.required]],
      title: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      assignedTo: ['', [Validators.required, Validators.email]],
      priority: ['medium', [Validators.required]],
      dueDate: ['', [Validators.required]]
    });

    this.loadProjects();
  }

  private loadProjects(): void {
    this.projectService.getProjects().subscribe({
      next: (projects) => this.projects.set(projects),
      error: (error) => console.error('Error loading projects:', error)
    });
  }

  ngOnInit(): void {
    if (this.task()) {
      const task = this.task()!;
      this.taskForm.patchValue({
        projectId: task.projectId,
        title: task.title,
        description: task.description,
        assignedTo: task.assignedTo,
        priority: task.priority,
        dueDate: new Date(task.dueDate).toISOString().split('T')[0]
      });
    }
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(null);

      const formValue = this.taskForm.value;
      const request = {
        ...formValue,
        dueDate: new Date(formValue.dueDate)
      };

      if (this.task()?.id) {
        this.taskService.updateTask(this.task()!.id, request).subscribe({
          next: () => {
            this.isLoading.set(false);
            this.submitted.emit();
          },
          error: (error) => {
            this.isLoading.set(false);
            this.errorMessage.set(error.error?.message || 'שגיאה בעדכון המשימה');
          }
        });
      } else {
        this.taskService.createTask(request).subscribe({
          next: () => {
            this.isLoading.set(false);
            this.submitted.emit();
          },
          error: (error) => {
            this.isLoading.set(false);
            this.errorMessage.set(error.error?.message || 'שגיאה ביצירת המשימה');
          }
        });
      }
    }
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.taskForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
