export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  assignedTo: string;
  createdBy: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  projectId: string;
  assignedTo: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: Date;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  assignedTo?: string;
  status?: 'todo' | 'in-progress' | 'review' | 'done';
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Date;
}

export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';
