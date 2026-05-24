# 📋 מערכת ניהול משימות בצוות - מדריך השלמה

## 📦 מה שנבנה

### 1️⃣ **Models (דגמים)**
- `user.model.ts` - משתמש, התחברות, הרשמה
- `team.model.ts` - צוואות וחברי צוואות
- `project.model.ts` - פרויקטים
- `task.model.ts` - משימות עם סטטוס ועדיפות

### 2️⃣ **Services (סרוויסים)**
- `api.service.ts` - שירות API גנרי לכל קריאות HTTP
- `auth.service.ts` - ניהול התחברות וטוקנים
- `team.service.ts` - ניהול צוואות
- `project.service.ts` - ניהול פרויקטים
- `task.service.ts` - ניהול משימות

### 3️⃣ **Guards (שומרים)**
- `auth.guard.ts` - בדוק אם המשתמש מחובר
- `role.guard.ts` - בדוק הרשאות המשתמש

### 4️⃣ **Components (קומפוננטות)**

#### Auth
- `LoginComponent` - דף התחברות
- `RegisterComponent` - דף הרשמה

#### Layout
- `LayoutComponent` - מבנה הדף (Navbar + Sidebar)
- `NavbarComponent` - שורת הניווט העליונה
- `SidebarComponent` - תפריט הניווט הצדדי

#### Dashboard
- `DashboardComponent` - דשבורד בעמוד הבית

#### Teams
- `TeamListComponent` - רשימת צוואות
- `TeamFormComponent` - טופס הוספה/עדכון צוות

#### Projects
- `ProjectListComponent` - רשימת פרויקטים
- `ProjectFormComponent` - טופס הוספה/עדכון פרויקט

#### Tasks
- `TaskListComponent` - Kanban Board עם משימות
- `TaskFormComponent` - טופס הוספה/עדכון משימה
- `TaskDetailComponent` - דף פרטי של משימה

---

## 🚀 איך להשתמש

### שלב 1️⃣: הפעלת שרת Backend

יצור API בשרת שלך (Node.js, NestJS, וכו') עם ה-endpoints הבאים:

```bash
POST   /api/auth/register
POST   /api/auth/login
GET    /api/teams
POST   /api/teams
PUT    /api/teams/:id
DELETE /api/teams/:id
GET    /api/projects
POST   /api/projects
PUT    /api/projects/:id
DELETE /api/projects/:id
GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

### שלב 2️⃣: הפעלת פרויקט Angular

```bash
npm install
ng serve
```

ביקור ב: http://localhost:4200

### שלב 3️⃣: זרימת משתמש

1. 📝 **הרשמה**: צור חשבון חדש
2. 🔐 **התחברות**: התחבר עם הנתונים שלך
3. 👥 **צוואות**: צור/נהל צוואות
4. 📂 **פרויקטים**: צור פרויקטים בתוך צוואות
5. ✅ **משימות**: צור משימות בפרויקטים
6. 🔄 **שינוי סטטוס**: גרור משימות בין עמודות

---

## 📊 מבנה Kanban Board

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  לביצוע    │  │  בביצוע    │  │   בבדיקה   │  │    בוצע    │
├─────────────┤  ├─────────────┤  ├─────────────┤  ├─────────────┤
│ משימה 1   │  │ משימה 3   │  │ משימה 5   │  │ משימה 7   │
│ משימה 2   │  │ משימה 4   │  │ משימה 6   │  │ משימה 8   │
└─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘
```

---

## 🔐 אבטחה

### Token Management
- הטוקן מאוחסן ב-localStorage
- נשלח בכל בקשה ב-Authorization header
- מחוק כשהמשתמש מתנתק

### Guards
- `authGuard` מגן על כל המסלולים המאובטחים
- משתמש לא מחובר יופנה ל-login

---

## 💾 Local Storage

```javascript
localStorage.getItem('token')           // JWT token
localStorage.getItem('currentUser')     // משתמש כרגע
```

---

## 🎨 סגנון (Styling)

### צבעים
- 🔵 ראשי: #667eea (סגול כחול)
- 🟣 משני: #764ba2 (סגול)
- 🟢 הצלחה: #28a745
- 🔴 שגיאה: #dc3545
- 🟠 אזהרה: #ffc107

### Typography
- RTL: כל הטקסט מיושר לימין
- עברית: תמיכה מלאה בעברית

---

## 🐛 Debugging

### Check Console Errors
```
Errors מוצגים בעברית בדרך כלל
כל טעות API משדרת ב-Observable subscription
```

### Network Tab
```
POST /api/auth/login
POST /api/teams
GET /api/projects
PUT /api/tasks/:id
```

---

## 📝 שדכום API Responses

### Login Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "123",
    "name": "ישי",
    "email": "user@example.com",
    "role": "user"
  }
}
```

### Task Object
```json
{
  "id": "456",
  "title": "בדיקת פיצ'ר חדש",
  "description": "בדוק את הפיצ'ר החדש",
  "projectId": "789",
  "assignedTo": "user@example.com",
  "status": "in-progress",
  "priority": "high",
  "dueDate": "2026-05-30T00:00:00.000Z"
}
```

---

## 🚨 Common Issues

### 1. CORS Error
- הוסף CORS headers לשרת Backend
- `Access-Control-Allow-Origin: *`

### 2. 404 on API
- בדוק שה-API URL זהה ב-api.service.ts
- ברירת מחדל: `http://localhost:3000/api`

### 3. Token Invalid
- בדוק ש-token לא פג
- נקה localStorage וקום מחדש

---

## ✅ Checklist

- [ ] Backend servers מורץ
- [ ] Database מוגדר
- [ ] Environment variables קובע
- [ ] API endpoints עובדים
- [ ] CORS מוגדר
- [ ] Angular app מורץ
- [ ] Login עובד
- [ ] Teams יומצרו
- [ ] Projects יומצרו
- [ ] Tasks יומצרו
- [ ] סטטוס משימות משתנה

---

## 📞 Support

אם יש בעיות או שאלות, בדוק:
1. Browser Console (F12)
2. Network Tab (בדוק API calls)
3. Local Storage (בדוק token)
4. Backend Server (בדוק ש-running)

---

## 🎓 Angular Best Practices שנעשו

✅ Standalone Components
✅ Signals State Management
✅ OnPush Change Detection
✅ Reactive Forms
✅ RxJS Observables
✅ Service Injection
✅ Guards for Route Protection
✅ RTL Support
✅ TypeScript Strict Mode
✅ Responsive Design

---

**נבנה בהצלחה! 🎉 אתה מוכן ליצור מערכת ניהול משימות מקצועית!**
