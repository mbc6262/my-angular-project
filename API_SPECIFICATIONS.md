# API Specifications for Task Management System

## 📡 Base URL
```
http://localhost:3000/api
```

---

## 🔐 Authentication Endpoints

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "string",
  "email": "string",
  "password": "string"
}

Response (200):
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "string (uuid)",
    "name": "string",
    "email": "string",
    "role": "user",
    "createdAt": "ISO8601"
  }
}
```

### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}

Response (200):
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "admin|user",
    "createdAt": "ISO8601"
  }
}

Headers: Authorization: Bearer {token}
```

---

## 👥 Teams Endpoints

### Get All Teams
```http
GET /teams
Headers: Authorization: Bearer {token}

Response (200):
[
  {
    "id": "string (uuid)",
    "name": "string",
    "description": "string",
    "createdBy": "string (user id)",
    "members": [
      {
        "userId": "string",
        "role": "owner|manager|member",
        "joinedAt": "ISO8601"
      }
    ],
    "createdAt": "ISO8601",
    "updatedAt": "ISO8601"
  }
]
```

### Get Team by ID
```http
GET /teams/{teamId}
Headers: Authorization: Bearer {token}

Response (200):
{
  "id": "string",
  "name": "string",
  "description": "string",
  "createdBy": "string",
  "members": [...],
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

### Create Team
```http
POST /teams
Content-Type: application/json
Headers: Authorization: Bearer {token}

{
  "name": "string",
  "description": "string"
}

Response (201):
{
  "id": "string",
  "name": "string",
  "description": "string",
  "createdBy": "string",
  "members": [],
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

### Update Team
```http
PUT /teams/{teamId}
Content-Type: application/json
Headers: Authorization: Bearer {token}

{
  "name": "string (optional)",
  "description": "string (optional)"
}

Response (200):
{
  "id": "string",
  "name": "string",
  "description": "string",
  "createdBy": "string",
  "members": [...],
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

### Delete Team
```http
DELETE /teams/{teamId}
Headers: Authorization: Bearer {token}

Response (200):
{
  "message": "Team deleted successfully"
}
```

### Add Team Member
```http
POST /teams/{teamId}/members
Content-Type: application/json
Headers: Authorization: Bearer {token}

{
  "userId": "string",
  "role": "owner|manager|member"
}

Response (201):
{
  "userId": "string",
  "role": "owner|manager|member",
  "joinedAt": "ISO8601"
}
```

### Remove Team Member
```http
DELETE /teams/{teamId}/members/{userId}
Headers: Authorization: Bearer {token}

Response (200):
{
  "message": "Member removed successfully"
}
```

---

## 📂 Projects Endpoints

### Get All Projects
```http
GET /projects
Headers: Authorization: Bearer {token}

Response (200):
[
  {
    "id": "string (uuid)",
    "name": "string",
    "description": "string",
    "teamId": "string",
    "createdBy": "string (user id)",
    "status": "active|completed|archived",
    "createdAt": "ISO8601",
    "updatedAt": "ISO8601"
  }
]
```

### Get Projects by Team
```http
GET /teams/{teamId}/projects
Headers: Authorization: Bearer {token}

Response (200):
[...]
```

### Get Project by ID
```http
GET /projects/{projectId}
Headers: Authorization: Bearer {token}

Response (200):
{
  "id": "string",
  "name": "string",
  "description": "string",
  "teamId": "string",
  "createdBy": "string",
  "status": "active|completed|archived",
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

### Create Project
```http
POST /projects
Content-Type: application/json
Headers: Authorization: Bearer {token}

{
  "name": "string",
  "description": "string",
  "teamId": "string"
}

Response (201):
{
  "id": "string",
  "name": "string",
  "description": "string",
  "teamId": "string",
  "createdBy": "string",
  "status": "active",
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

### Update Project
```http
PUT /projects/{projectId}
Content-Type: application/json
Headers: Authorization: Bearer {token}

{
  "name": "string (optional)",
  "description": "string (optional)",
  "status": "active|completed|archived (optional)"
}

Response (200):
{
  "id": "string",
  "name": "string",
  "description": "string",
  "teamId": "string",
  "createdBy": "string",
  "status": "active|completed|archived",
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

### Delete Project
```http
DELETE /projects/{projectId}
Headers: Authorization: Bearer {token}

Response (200):
{
  "message": "Project deleted successfully"
}
```

---

## ✅ Tasks Endpoints

### Get All Tasks
```http
GET /tasks
Headers: Authorization: Bearer {token}

Response (200):
[
  {
    "id": "string (uuid)",
    "title": "string",
    "description": "string",
    "projectId": "string",
    "assignedTo": "string (user email)",
    "createdBy": "string (user id)",
    "status": "todo|in-progress|review|done",
    "priority": "low|medium|high",
    "dueDate": "ISO8601",
    "createdAt": "ISO8601",
    "updatedAt": "ISO8601"
  }
]
```

### Get Tasks by Project
```http
GET /projects/{projectId}/tasks
Headers: Authorization: Bearer {token}

Response (200):
[...]
```

### Get User's Tasks
```http
GET /tasks/my-tasks
Headers: Authorization: Bearer {token}

Response (200):
[...]
```

### Get Task by ID
```http
GET /tasks/{taskId}
Headers: Authorization: Bearer {token}

Response (200):
{
  "id": "string",
  "title": "string",
  "description": "string",
  "projectId": "string",
  "assignedTo": "string",
  "createdBy": "string",
  "status": "todo|in-progress|review|done",
  "priority": "low|medium|high",
  "dueDate": "ISO8601",
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

### Create Task
```http
POST /tasks
Content-Type: application/json
Headers: Authorization: Bearer {token}

{
  "title": "string",
  "description": "string",
  "projectId": "string",
  "assignedTo": "string (user email)",
  "priority": "low|medium|high",
  "dueDate": "ISO8601"
}

Response (201):
{
  "id": "string",
  "title": "string",
  "description": "string",
  "projectId": "string",
  "assignedTo": "string",
  "createdBy": "string",
  "status": "todo",
  "priority": "low|medium|high",
  "dueDate": "ISO8601",
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

### Update Task
```http
PUT /tasks/{taskId}
Content-Type: application/json
Headers: Authorization: Bearer {token}

{
  "title": "string (optional)",
  "description": "string (optional)",
  "assignedTo": "string (optional)",
  "status": "todo|in-progress|review|done (optional)",
  "priority": "low|medium|high (optional)",
  "dueDate": "ISO8601 (optional)"
}

Response (200):
{
  "id": "string",
  "title": "string",
  "description": "string",
  "projectId": "string",
  "assignedTo": "string",
  "createdBy": "string",
  "status": "todo|in-progress|review|done",
  "priority": "low|medium|high",
  "dueDate": "ISO8601",
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

### Delete Task
```http
DELETE /tasks/{taskId}
Headers: Authorization: Bearer {token}

Response (200):
{
  "message": "Task deleted successfully"
}
```

---

## ⚠️ Error Responses

### 400 Bad Request
```json
{
  "message": "Invalid input",
  "errors": {
    "email": "Invalid email format"
  }
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid credentials"
}
```

### 403 Forbidden
```json
{
  "message": "You don't have permission"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error"
}
```

---

## 🔧 Implementation Notes

1. **Authentication**: Use JWT tokens in Authorization header
2. **CORS**: Enable CORS for localhost:4200
3. **Validation**: Validate all inputs
4. **Timestamps**: Use ISO8601 format for all dates
5. **IDs**: Use UUID for all resource IDs
6. **HTTP Status Codes**:
   - 200: OK
   - 201: Created
   - 400: Bad Request
   - 401: Unauthorized
   - 403: Forbidden
   - 404: Not Found
   - 500: Server Error

---

## 📝 Database Schema Suggestions

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Teams Table
```sql
CREATE TABLE teams (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Team Members Table
```sql
CREATE TABLE team_members (
  id UUID PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES teams(id),
  user_id UUID NOT NULL REFERENCES users(id),
  role ENUM('owner', 'manager', 'member') DEFAULT 'member',
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(team_id, user_id)
);
```

### Projects Table
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  team_id UUID NOT NULL REFERENCES teams(id),
  created_by UUID NOT NULL REFERENCES users(id),
  status ENUM('active', 'completed', 'archived') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  project_id UUID NOT NULL REFERENCES projects(id),
  assigned_to VARCHAR(255),
  created_by UUID NOT NULL REFERENCES users(id),
  status ENUM('todo', 'in-progress', 'review', 'done') DEFAULT 'todo',
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  due_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

**כל API endpoints מוגדרים וזמינים להטמעה!** 🚀
