import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { ApiService } from './api.service';
import { Project, CreateProjectRequest, UpdateProjectRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiService = inject(ApiService);

  // Get all projects
  getProjects() {
    return this.apiService.get<Project[]>('/projects');
  }

  // Get projects by team
  getProjectsByTeam(teamId: string) {
    return this.apiService.get<Project[]>(`/teams/${teamId}/projects`);
  }

  // Get single project by ID
  getProjectById(projectId: string) {
    return this.apiService.get<Project>(`/projects/${projectId}`);
  }

  // Create new project
  createProject(request: CreateProjectRequest) {
    return this.apiService.post<Project>('/projects', request);
  }

  // Update project
  updateProject(projectId: string, request: UpdateProjectRequest) {
    return this.apiService.put<Project>(`/projects/${projectId}`, request);
  }

  // Delete project
  deleteProject(projectId: string) {
    return this.apiService.delete<void>(`/projects/${projectId}`);
  }
}
