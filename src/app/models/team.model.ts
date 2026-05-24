import { User } from './user.model';

export interface Team {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  members: TeamMember[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  userId: string;
  user?: User;
  role: 'owner' | 'manager' | 'member';
  joinedAt: Date;
}

export interface CreateTeamRequest {
  name: string;
  description: string;
}

export interface UpdateTeamRequest {
  name?: string;
  description?: string;
}
