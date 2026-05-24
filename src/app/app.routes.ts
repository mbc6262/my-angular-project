import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './guards';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TeamListComponent } from './components/teams/team-list/team-list.component';
import { ProjectListComponent } from './components/projects/project-list/project-list.component';
import { TaskListComponent } from './components/tasks/task-list/task-list.component';
import { TaskDetailComponent } from './components/tasks/task-detail/task-detail.component';
export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: '', 
    redirectTo: '/login', // מעביר אוטומטית ל-login אם המשתמש לא מחובר
    pathMatch: 'full'
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'teams',
        component: TeamListComponent
      },
      {
        path: 'projects',
        component: ProjectListComponent
      },
      {
        path: 'tasks',
        component: TaskListComponent
      },
      {
        path: 'tasks/:id',
        component: TaskDetailComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
