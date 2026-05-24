import { Component, ChangeDetectionStrategy, signal, output, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TeamService } from '../../../services';
import { Team } from '../../../models';

@Component({
  selector: 'app-team-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="form-container">
      <h2>{{ team()?.id ? 'עדכון צוות' : 'צוות חדש' }}</h2>
      
      @if (errorMessage()) {
        <div class="error-message">{{ errorMessage() }}</div>
      }

      <form [formGroup]="teamForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="name">שם הצוות</label>
          <input
            type="text"
            id="name"
            formControlName="name"
            placeholder="הכנס שם צוות"
            [class.error]="isFieldInvalid('name')"
          />
          @if (isFieldInvalid('name')) {
            <span class="error-text">שם צוות נדרש</span>
          }
        </div>

        <div class="form-group">
          <label for="description">תיאור</label>
          <textarea
            id="description"
            formControlName="description"
            placeholder="תיאור הצוות"
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
            [disabled]="teamForm.invalid || isLoading()"
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
    textarea {
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
    textarea:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 5px rgba(102, 126, 234, 0.3);
    }

    input.error,
    textarea.error {
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
export class TeamFormComponent {
  private teamService = inject(TeamService);
  private fb = inject(FormBuilder);

  team = input<Team | undefined>();
  submitted = output<void>();
  cancelled = output<void>();

  teamForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor() {
    this.teamForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    if (this.team()) {
      this.teamForm.patchValue({
        name: this.team()?.name,
        description: this.team()?.description
      });
    }
  }

  onSubmit(): void {
    if (this.teamForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(null);

      const request = this.teamForm.value;

      if (this.team()?.id) {
        // Update existing team
        this.teamService.updateTeam(this.team()!.id, request).subscribe({
          next: () => {
            this.isLoading.set(false);
            this.submitted.emit();
          },
          error: (error) => {
            this.isLoading.set(false);
            this.errorMessage.set(error.error?.message || 'שגיאה בעדכון הצוות');
          }
        });
      } else {
        // Create new team
        this.teamService.createTeam(request).subscribe({
          next: () => {
            this.isLoading.set(false);
            this.submitted.emit();
          },
          error: (error) => {
            this.isLoading.set(false);
            this.errorMessage.set(error.error?.message || 'שגיאה ביצירת הצוות');
          }
        });
      }
    }
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.teamForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
