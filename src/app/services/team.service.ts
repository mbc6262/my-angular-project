import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { ApiService } from './api.service';
import { Team, CreateTeamRequest, UpdateTeamRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private apiService = inject(ApiService);

  // Get all teams
  getTeams() {
    return this.apiService.get<Team[]>('/teams');
  }

  // Get single team by ID
  getTeamById(teamId: string) {
    return this.apiService.get<Team>(`/teams/${teamId}`);
  }

  // Create new team
  createTeam(request: CreateTeamRequest) {
    return this.apiService.post<Team>('/teams', request);
  }

  // Update team
  updateTeam(teamId: string, request: UpdateTeamRequest) {
    return this.apiService.put<Team>(`/teams/${teamId}`, request);
  }

  // Delete team
  deleteTeam(teamId: string) {
    return this.apiService.delete<void>(`/teams/${teamId}`);
  }

  // Add member to team
  addMember(teamId: string, userId: string, role: 'owner' | 'manager' | 'member') {
    return this.apiService.post(`/teams/${teamId}/members`, { userId, role });
  }

  // Remove member from team
  removeMember(teamId: string, userId: string) {
    return this.apiService.delete(`/teams/${teamId}/members/${userId}`);
  }
}
