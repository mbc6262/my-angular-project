import { Component, ChangeDetectionStrategy, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamService, ProjectService, TaskService } from '../../services';
import { Team } from '../../models/team.model';
import { Project } from '../../models/project.model';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dashboard">
      <h1>🎯 דשבורד</h1>
      
      <div class="stats-container">
        <div class="stat-card">
          <div class="stat-number">{{ teams().length }}</div>
          <div class="stat-label">צוותים</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ projects().length }}</div>
          <div class="stat-label">פרויקטים</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ tasks().length }}</div>
          <div class="stat-label">משימות</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ tasksInProgressCount() }}</div>
          <div class="stat-label">בביצוע</div>
        </div>
      </div>

      <div class="recent-section">
        <h2>משימות שלי בביצוע</h2>
        @if (inProgressTasks().length > 0) {
          <div class="tasks-grid">
            @for (task of inProgressTasks().slice(0, 6); track task.id) {
              <div class="task-card">
                <h3>{{ task.title }}</h3>
                <p>{{ task.description }}</p>
                <div class="task-meta">
                  <span class="priority" [class]="'priority-' + task.priority">{{ task.priority }}</span>
                  <span class="status">{{ task.status }}</span>
                </div>
              </div>
            }
          </div>
        } @else {
          <p class="no-data">אין משימות בביצוע</p>
        }
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      direction: rtl;
    }

    h1 {
      font-size: 32px;
      margin-bottom: 30px;
      color: #333;
    }

    .stats-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }

    .stat-card {
      background: white;
      padding: 25px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    .stat-number {
      font-size: 40px;
      font-weight: 700;
      color: #667eea;
      margin-bottom: 10px;
    }

    .stat-label {
      font-size: 16px;
      color: #666;
      font-weight: 500;
    }

    .recent-section {
      margin-top: 40px;
    }

    .recent-section h2 {
      font-size: 24px;
      margin-bottom: 20px;
      color: #333;
    }

    .tasks-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .task-card {
      background: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      border-right: 4px solid #667eea;
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .task-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
    }

    .task-card h3 {
      font-size: 18px;
      margin: 0 0 10px 0;
      color: #333;
    }

    .task-card p {
      font-size: 14px;
      color: #666;
      margin: 0 0 15px 0;
      line-height: 1.5;
    }

    .task-meta {
      display: flex;
      gap: 10px;
      justify-content: flex-start;
    }

    .priority {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
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

    .status {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      background-color: #f0f0f0;
      color: #666;
    }

    .no-data {
      text-align: center;
      color: #999;
      padding: 40px 20px;
      font-size: 16px;
    }
  `]
})
export class DashboardComponent implements OnInit {
  private teamService = inject(TeamService);
  private projectService = inject(ProjectService);
  private taskService = inject(TaskService);

  // הגדרת ה-Signals
  teams = signal<Team[]>([]);
  projects = signal<Project[]>([]);
  tasks = signal<Task[]>([]);

  // שימוש ב-computed במקום לעדכן ידנית או להשתמש בפונקציה רגילה
  inProgressTasks = computed(() => {
    return this.tasks().filter(task => task.status === 'in-progress');
  });

  tasksInProgressCount = computed(() => {
    return this.inProgressTasks().length;
  });

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    // טעינת צוותים עם הגדרת טיפוס מפורשת ב-Next
    this.teamService.getTeams().subscribe({
      next: (teams: Team[]) => this.teams.set(teams),
      error: (error: any) => console.error('Error loading teams:', error)
    });

    // טעינת פרויקטים
    this.projectService.getProjects().subscribe({
      next: (projects: Project[]) => this.projects.set(projects),
      error: (error: any) => console.error('Error loading projects:', error)
    });

    // טעינת משימות
    this.taskService.getTasks().subscribe({
      next: (tasks: Task[]) => this.tasks.set(tasks),
      error: (error: any) => console.error('Error loading tasks:', error)
    });
  }
}