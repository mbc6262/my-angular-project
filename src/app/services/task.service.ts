import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { ApiService } from './api.service';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiService = inject(ApiService);

  // Get all tasks
  getTasks() {
    return this.apiService.get<Task[]>('/tasks');
  }

  // Get tasks by project
  getTasksByProject(projectId: string) {
 
  return this.apiService.get<Task[]>(`/tasks?projectId=${projectId}`);
}

  // Get single task by ID
  getTaskById(taskId: string) {
    return this.apiService.get<Task>(`/tasks/${taskId}`);
  }

  // Create new task
  createTask(request: CreateTaskRequest) {
    return this.apiService.post<Task>('/tasks', request);
  }

  // Update task
  updateTask(taskId: string, request: UpdateTaskRequest) {
    return this.apiService.put<Task>(`/tasks/${taskId}`, request);
  }

  // Delete task
  deleteTask(taskId: string) {
    return this.apiService.delete<void>(`/tasks/${taskId}`);
  }

  // Update task status
  updateTaskStatus(taskId: string, status: 'todo' | 'in-progress' | 'review' | 'done') {
    return this.apiService.put<Task>(`/tasks/${taskId}`, { status });
  }

  // Get tasks assigned to current user
  getMyTasks() {
    return this.apiService.get<Task[]>('/tasks/my-tasks');
  }
}
