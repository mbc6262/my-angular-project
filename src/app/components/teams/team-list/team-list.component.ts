import { Component, ChangeDetectionStrategy, signal, effect, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamService } from '../../../services';
import { Team } from '../../../models';
import { TeamFormComponent } from '../team-form/team-form.component';

@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [CommonModule, TeamFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="teams-container">
      <div class="header">
        <h1>👥 צוותים</h1>
        <button (click)="toggleForm()" class="add-btn">
          {{ showForm() ? 'ביטול' : '+ צוות חדש' }}
        </button>
      </div>

      @if (showForm()) {
        <app-team-form
          [team]="selectedTeam()"
          (submitted)="onTeamSubmitted()"
          (cancelled)="toggleForm()"
        ></app-team-form>
      }

      @if (isLoading()) {
        <div class="loading">טוען...</div>
      } @else if (teams().length > 0) {
        <div class="teams-grid">
          @for (team of teams(); track team.id) {
            <div class="team-card">
              <h3>{{ team.name }}</h3>
              <p>{{ team.description }}</p>
              <div class="team-footer">
                <span class="member-count">{{ team.members.length || 0 }} חברים</span>
                <div class="actions">
                  <button (click)="editTeam(team)" class="edit-btn" title="עדכן">✏️</button>
                  <button (click)="deleteTeam(team.id)" class="delete-btn" title="מחק">🗑️</button>
                </div>
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="no-data">
          <p>אין צוותים עדיין</p>
          <button (click)="toggleForm()">צור צוות חדש</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .teams-container {
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

    .teams-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .team-card {
      background: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      transition: all 0.3s;
      border-right: 4px solid #667eea;
    }

    .team-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
    }

    .team-card h3 {
      margin: 0 0 10px 0;
      color: #333;
      font-size: 20px;
    }

    .team-card p {
      margin: 0 0 15px 0;
      color: #666;
      font-size: 14px;
      line-height: 1.5;
    }

    .team-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid #eee;
      padding-top: 15px;
    }

    .member-count {
      font-size: 13px;
      color: #999;
      font-weight: 500;
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
export class TeamListComponent implements OnInit {
  private teamService = inject(TeamService);

  teams = signal<Team[]>([]);
  selectedTeam = signal<Team | undefined>(undefined);
  isLoading = signal(false);
  showForm = signal(false);

  ngOnInit(): void {
    this.loadTeams();
  }

  loadTeams(): void {
    this.isLoading.set(true);
    this.teamService.getTeams().subscribe({
      next: (teams) => {
        this.teams.set(teams);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading teams:', error);
        this.isLoading.set(false);
      }
    });
  }

  toggleForm(): void {
    this.selectedTeam.set(undefined);
    this.showForm.update(val => !val);
  }

  onTeamSubmitted(): void {
    this.selectedTeam.set(undefined);
    this.showForm.set(false);
    this.loadTeams();
  }

  editTeam(team: Team): void {
    this.selectedTeam.set(team);
    this.showForm.set(true);
  }

  deleteTeam(teamId: string): void {
    if (confirm('האם אתה בטוח שברצונך למחוק את הצוות?')) {
      this.teamService.deleteTeam(teamId).subscribe({
        next: () => this.loadTeams(),
        error: (error) => console.error('Error deleting team:', error)
      });
    }
  }
}
