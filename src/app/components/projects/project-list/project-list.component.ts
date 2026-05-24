import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../../services';
import { Project } from '../../../models';
import { ProjectFormComponent } from '../project-form/project-form.component';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, ProjectFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="projects-container">
      <div class="header">
        <h1>📂 פרויקטים</h1>
        <button (click)="toggleForm()" class="add-btn">
          {{ showForm() ? 'ביטול' : '+ פרויקט חדש' }}
        </button>
      </div>

      @if (showForm()) {
        <app-project-form
          [project]="selectedProject()"
          (submitted)="onProjectSubmitted()"
          (cancelled)="toggleForm()"
        ></app-project-form>
      }

      @if (isLoading()) {
        <div class="loading">טוען...</div>
      } @else if (projects().length > 0) {
        <div class="projects-grid">
          @for (project of projects(); track project.id) {
            <div class="project-card" [class]="'status-' + project.status">
              <h3>{{ project.name }}</h3>
              <p>{{ project.description }}</p>
              <div class="project-footer">
                <span class="status-badge">{{ project.status }}</span>
                <div class="actions">
                  <button (click)="editProject(project)" class="edit-btn" title="עדכן">✏️</button>
                  <button (click)="deleteProject(project.id)" class="delete-btn" title="מחק">🗑️</button>
                </div>
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="no-data">
          <p>אין פרויקטים עדיין</p>
          <button (click)="toggleForm()">צור פרויקט חדש</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .projects-container {
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

    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .project-card {
      background: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      transition: all 0.3s;
      border-right: 4px solid #667eea;
    }

    .project-card.status-active {
      border-right-color: #28a745;
    }

    .project-card.status-completed {
      border-right-color: #17a2b8;
    }

    .project-card.status-archived {
      border-right-color: #999;
      opacity: 0.7;
    }

    .project-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
    }

    .project-card h3 {
      margin: 0 0 10px 0;
      color: #333;
      font-size: 20px;
    }

    .project-card p {
      margin: 0 0 15px 0;
      color: #666;
      font-size: 14px;
      line-height: 1.5;
    }

    .project-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid #eee;
      padding-top: 15px;
    }

    .status-badge {
      font-size: 12px;
      font-weight: 600;
      padding: 4px 12px;
      border-radius: 20px;
      background-color: #e7e5ff;
      color: #667eea;
      text-transform: uppercase;
    }

    .actions {
      display: flex;
      gap: 8px;
    }

    .edit-btn,
    .delete-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 18px;
      transition: transform 0.2s;
    }

    .edit-btn:hover,
    .delete-btn:hover {
      transform: scale(1.2);
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
export class ProjectListComponent implements OnInit {
  private projectService = inject(ProjectService);

  projects = signal<Project[]>([]);
  selectedProject = signal<Project | undefined>(undefined);
  isLoading = signal(false);
  showForm = signal(false);

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.isLoading.set(true);
    this.projectService.getProjects().subscribe({
      next: (projects) => {
        this.projects.set(projects);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.isLoading.set(false);
      }
    });
  }

  toggleForm(): void {
    this.selectedProject.set(undefined);
    this.showForm.update(val => !val);
  }

  onProjectSubmitted(): void {
    this.selectedProject.set(undefined);
    this.showForm.set(false);
    this.loadProjects();
  }

  editProject(project: Project): void {
    this.selectedProject.set(project);
    this.showForm.set(true);
  }

  deleteProject(projectId: string): void {
    if (confirm('האם אתה בטוח שברצונך למחוק את הפרויקט?')) {
      this.projectService.deleteProject(projectId).subscribe({
        next: () => this.loadProjects(),
        error: (error) => console.error('Error deleting project:', error)
      });
    }
  }
}
