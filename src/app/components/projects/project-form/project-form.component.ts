import { Component, ChangeDetectionStrategy, signal, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectService, TeamService } from '../../../services';
import { Project, Team } from '../../../models';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="form-container">
      <h2>{{ project()?.id ? 'עדכון פרויקט' : 'פרויקט חדש' }}</h2>
      
      @if (errorMessage()) {
        <div class="error-message">{{ errorMessage() }}</div>
      }

      <form [formGroup]="projectForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="teamId">צוות</label>
          <select
            id="teamId"
            formControlName="teamId"
            [class.error]="isFieldInvalid('teamId')"
          >
            <option value="">בחר צוות</option>
            @for (team of teams(); track team.id) {
              <option [value]="team.id">{{ team.name }}</option>
            }
          </select>
          @if (isFieldInvalid('teamId')) {
            <span class="error-text">צוות נדרש</span>
          }
        </div>

        <div class="form-group">
          <label for="name">שם הפרויקט</label>
          <input
            type="text"
            id="name"
            formControlName="name"
            placeholder="הכנס שם פרויקט"
            [class.error]="isFieldInvalid('name')"
          />
          @if (isFieldInvalid('name')) {
            <span class="error-text">שם פרויקט נדרש</span>
          }
        </div>

        <div class="form-group">
          <label for="description">תיאור</label>
          <textarea
            id="description"
            formControlName="description"
            placeholder="תיאור הפרויקט"
            rows="4"
            [class.error]="isFieldInvalid('description')"
          ></textarea>
          @if (isFieldInvalid('description')) {
            <span class="error-text">תיאור נדרש</span>
          }
        </div>

        <div class="form-actions">
          <button
            type="submit"
            [disabled]="projectForm.invalid || isLoading()"
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
export class ProjectFormComponent {
  private projectService = inject(ProjectService);
  private teamService = inject(TeamService);
  private fb = inject(FormBuilder);

  project = input<Project | undefined>();
  teams = signal<Team[]>([]);
  submitted = output<void>();
  cancelled = output<void>();

  projectForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor() {
    this.projectForm = this.fb.group({
      teamId: ['', [Validators.required]],
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(5)]]
    });

    this.loadTeams();
  }

  private loadTeams(): void {
    this.teamService.getTeams().subscribe({
      next: (teams) => this.teams.set(teams),
      error: (error) => console.error('Error loading teams:', error)
    });
  }

  ngOnInit(): void {
    if (this.project()) {
      this.projectForm.patchValue({
        teamId: this.project()?.teamId,
        name: this.project()?.name,
        description: this.project()?.description
      });
    }
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(null);

      const request = this.projectForm.value;

      if (this.project()?.id) {
        this.projectService.updateProject(this.project()!.id, request).subscribe({
          next: () => {
            this.isLoading.set(false);
            this.submitted.emit();
          },
          error: (error) => {
            this.isLoading.set(false);
            this.errorMessage.set(error.error?.message || 'שגיאה בעדכון הפרויקט');
          }
        });
      } else {
        this.projectService.createProject(request).subscribe({
          next: () => {
            this.isLoading.set(false);
            this.submitted.emit();
          },
          error: (error) => {
            this.isLoading.set(false);
            this.errorMessage.set(error.error?.message || 'שגיאה ביצירת הפרויקט');
          }
        });
      }
    }
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.projectForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
