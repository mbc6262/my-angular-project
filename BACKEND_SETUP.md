# Backend Implementation Quick Start

## 🚀 Option 1: Using NestJS (Recommended)

### Installation
```bash
npm install -g @nestjs/cli
nest new task-management-api
cd task-management-api
```

### Install Dependencies
```bash
npm install @nestjs/common @nestjs/platform-express @nestjs/jwt @nestjs/passport passport passport-jwt
npm install bcryptjs uuid
npm install --save-dev @types/node @types/bcryptjs
```

### Generate Resources
```bash
nest generate module auth
nest generate controller auth
nest generate service auth

nest generate module teams
nest generate controller teams
nest generate service teams

nest generate module projects
nest generate controller projects
nest generate service projects

nest generate module tasks
nest generate controller tasks
nest generate service tasks
```

### app.module.ts
```typescript
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TeamsModule } from './teams/teams.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [AuthModule, TeamsModule, ProjectsModule, TasksModule],
})
export class AppModule {}
```

### auth.service.ts
```typescript
import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private users = []; // Replace with database

  constructor(private jwtService: JwtService) {}

  async register(name: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: uuid(),
      name,
      email,
      password: hashedPassword,
      role: 'user',
      createdAt: new Date()
    };
    this.users.push(user);

    const token = this.jwtService.sign({ id: user.id, email });
    const { password, ...result } = user;
    return { token, user: result };
  }

  async login(email: string, password: string) {
    const user = this.users.find(u => u.email === email);
    if (!user) throw new Error('Invalid credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid credentials');

    const token = this.jwtService.sign({ id: user.id, email });
    const { password: _, ...result } = user;
    return { token, user: result };
  }
}
```

### main.ts
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true
  });
  app.setGlobalPrefix('api');
  await app.listen(3000);
  console.log(`Server is running on http://localhost:3000/api`);
}
bootstrap();
```

### Run
```bash
npm run start:dev
```

---

## 🚀 Option 2: Using Express.js

### Installation
```bash
npm init -y
npm install express cors uuid jsonwebtoken bcryptjs
npm install --save-dev nodemon @types/express @types/node typescript
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### src/server.ts
```typescript
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import teamRoutes from './routes/teams';
import projectRoutes from './routes/projects';
import taskRoutes from './routes/tasks';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/api`);
});
```

### src/routes/auth.ts
```typescript
import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';

const router = Router();
const JWT_SECRET = 'your-secret-key';
let users: any[] = [];

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: uuid(),
      name,
      email,
      password: hashedPassword,
      role: 'user',
      createdAt: new Date()
    };
    users.push(user);

    const token = jwt.sign({ id: user.id, email }, JWT_SECRET);
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    res.status(400).json({ message: 'Error registering user' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email }, JWT_SECRET);
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

export default router;
```

### package.json
```json
{
  "scripts": {
    "start": "node dist/server.js",
    "dev": "nodemon --exec ts-node src/server.ts"
  }
}
```

### Run
```bash
npm run dev
```

---

## 🚀 Option 3: Using Node.js with Prisma ORM

### Installation
```bash
npm init -y
npm install express cors prisma @prisma/client jsonwebtoken bcryptjs
npm install --save-dev nodemon typescript @types/express @types/node ts-node
```

### Initialize Prisma
```bash
npx prisma init
```

### .env
```env
DATABASE_URL="postgresql://user:password@localhost:5432/task_management"
JWT_SECRET="your-secret-key"
```

### prisma/schema.prisma
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id    String  @id @default(uuid())
  name  String
  email String  @unique
  password String
  role  String  @default("user")
  createdAt DateTime @default(now())
  
  teams Team[]
  projects Project[]
  tasks Task[]
}

model Team {
  id    String  @id @default(uuid())
  name  String
  description String?
  createdBy String
  user  User @relation(fields: [createdBy], references: [id])
  
  members TeamMember[]
  projects Project[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model TeamMember {
  id    String  @id @default(uuid())
  teamId String
  team  Team @relation(fields: [teamId], references: [id])
  userId String
  role  String @default("member")
  joinedAt DateTime @default(now())
}

model Project {
  id    String  @id @default(uuid())
  name  String
  description String?
  teamId String
  team  Team @relation(fields: [teamId], references: [id])
  createdBy String
  user  User @relation(fields: [createdBy], references: [id])
  status String @default("active")
  
  tasks Task[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Task {
  id    String  @id @default(uuid())
  title String
  description String?
  projectId String
  project Project @relation(fields: [projectId], references: [id])
  assignedTo String?
  createdBy String
  user  User @relation(fields: [createdBy], references: [id])
  status String @default("todo")
  priority String @default("medium")
  dueDate DateTime?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Create Tables
```bash
npx prisma migrate dev --name init
```

---

## 🗄️ Database Options

1. **PostgreSQL** - Production ready, recommended
2. **MySQL** - Good alternative
3. **MongoDB** - NoSQL option
4. **SQLite** - Development/testing

---

## 🔐 JWT Configuration

```typescript
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRE = '7d';

// Generate token
const token = jwt.sign({ id, email }, JWT_SECRET, { expiresIn: JWT_EXPIRE });

// Verify token
jwt.verify(token, JWT_SECRET);
```

---

## 📝 Middleware: Verify JWT

```typescript
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Use in routes
router.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'Protected route', user: (req as any).user });
});
```

---

## 🧪 Testing with cURL

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ישי",
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Create Team (with token)
```bash
curl -X POST http://localhost:3000/api/teams \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "צוות פיתוח",
    "description": "צוות פיתוח הפרויקט"
  }'
```

---

**בחר את האפשרות המתאימה ליצור את ה-Backend שלך!** 🎯
