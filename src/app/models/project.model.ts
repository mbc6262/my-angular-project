export interface Project {
  id: string;
  name: string;
  description: string;
  teamId: string;
  createdBy: string;
  status: 'active' | 'completed' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  teamId: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  status?: 'active' | 'completed' | 'archived';
}
