# 📋 TaskFlow - Complete Project Documentation

*Version 1.0 | January 2026*

---

## 📖 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Technologies](#technologies)
4. [Database](#database)
5. [Backend (API)](#backend-api)
6. [Frontend](#frontend)
7. [Features](#features)
8. [Hosting](#hosting)
9. [Configuration](#configuration)

---

## 🎯 Overview

**TaskFlow** is a modern full-stack task management system with rich features including time tracking, achievements, and a beautiful user interface.

### Key Features:
- ✅ CRUD operations for tasks
- ⏱️ Time tracking with timer functionality
- 🏆 Achievement system
- 📊 Change history
- 🎨 Dark/Light mode
- 🔐 JWT Authentication
- 📱 Responsive design
- 🌐 Production-ready hosting configuration

---

## 🏗️ Architecture

The project follows **Clean Architecture** principles with clear separation of layers:

```
TaskFlow/
├── TaskFlow.API          # Presentation Layer (ASP.NET Web API)
├── TaskFlow.Application  # Business Logic Layer (CQRS/MediatR)
├── TaskFlow.Domain       # Domain Layer (Entities, Enums)
├── TaskFlow.Infrastructure # Data Access Layer (EF Core, Services)
├── TaskFlow.Web          # Frontend (React + TypeScript + Vite)
└── TaskFlow.Tests        # Unit Tests
```

### Patterns Used:
- **CQRS** - Command Query Responsibility Segregation
- **MediatR** - Mediator pattern for commands and queries
- **Repository Pattern** - Data access abstraction
- **Dependency Injection** - For loose coupling

---

## 💻 Technologies

### Backend (.NET 8)
- **ASP.NET Core 8.0** - Web API framework
- **Entity Framework Core** - ORM for database
- **MediatR** - CQRS implementation
- **JWT Bearer Authentication** - For security
- **SQLite** - Database (easy to deploy)
- **Swagger** - API documentation

### Frontend (React 18)
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool (fast dev server)
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Animations
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icons

---

## 🗄️ Database

### Tables (Entities):

#### 1. **TaskItem** - Tasks
```
- Id (Guid) - Unique identifier
- Title (string) - Task title
- Description (string) - Description
- DueDate (DateTime?) - Due date
- Priority (enum) - Low/Medium/High
- Status (enum) - Todo/InProgress/Done
- Color (string) - Task color
- Order (int) - Order in list
- TimeSpentSeconds (long) - Time spent
- TrackingStartedAt (DateTime?) - Timer start time
- IsArchived (bool) - Is archived
- ArchivedAt (DateTime?) - When archived
- UserId (string) - Owner
- CreatedAt (DateTime) - Created at
- UpdatedAt (DateTime) - Updated at
```

#### 2. **AppUser** - Users
```
- Id (string) - User ID from ASP.NET Identity
- Username (string) - Username
- PasswordHash (string) - Hashed password
- CreatedAt (DateTime) - Registration date
```

#### 3. **Achievement** - Achievements
```
- Id (Guid) - Unique identifier
- Name (string) - Achievement name
- Description (string) - Description
- Icon (string) - Icon
- Threshold (int) - Unlock condition
```

#### 4. **UserAchievement** - User-Achievement Relationship
```
- Id (Guid) - Unique identifier
- UserId (string) - User
- AchievementId (Guid) - Achievement
- UnlockedAt (DateTime) - When unlocked
```

---

## 🔌 Backend (API)

### API Endpoints:

#### **Auth Controller** (`/api/auth`)
- `POST /login` - Login to the system
- `POST /register` - Registration
- `POST /change-password` - Change password [Auth Required]

#### **Tasks Controller** (`/api/tasks`)
- `GET /` - All tasks of current user [Auth]
- `POST /` - Create new task [Auth]
- `PUT /{id}` - Update task [Auth]
- `DELETE /{id}` - Delete task [Auth]
- `POST /search` - Search tasks [Auth]
- `PATCH /{id}/status` - Update status [Auth]
- `POST /{id}/toggle-timer` - Start/stop timer [Auth]
- `POST /{id}/archive` - Archive task [Auth]
- `PATCH /{id}/reorder` - Change order [Auth]

#### **Achievements Controller** (`/api/achievements`)
- `GET /available` - Available achievements [Auth]
- `GET /user` - User's achievements [Auth]

### CQRS Commands & Queries:

**Commands (state changes):**
- `CreateTaskCommand`
- `UpdateTaskCommand`
- `DeleteTaskCommand`
- `UpdateTaskStatusCommand`
- `ToggleTimerCommand`
- `ArchiveTaskCommand`
- `ReorderTaskCommand`
- `LoginCommand`
- `RegisterCommand`
- `ChangePasswordCommand`

**Queries (data reads):**
- `GetAllTasksQuery`
- `SearchTasksQuery`
- `GetAvailableAchievementsQuery`
- `GetUserAchievementsQuery`

---

## 🎨 Frontend

### Component Structure:

```
src/
├── pages/
│   ├── Login.tsx          # Login page
│   ├── Register.tsx       # Registration page
│   └── Tasks.tsx          # Main tasks page
├── components/
│   ├── AccountModal.tsx   # Account settings modal
│   ├── AchievementModal.tsx # Achievements modal
│   ├── HistoryDrawer.tsx  # Change history
│   ├── ThemeProvider.tsx  # Dark/Light mode
│   └── UserMenu.tsx       # User menu
├── lib/
│   └── api.ts             # Axios instance with JWT
├── App.tsx                # Main app component
└── main.tsx               # Entry point
```

### Key Features:

#### **Tasks.tsx** - Main Page
- Drag & Drop for reordering (dnd-kit)
- Inline task editing
- Time tracking with visual timer
- Filters (All/Active/Completed)
- Search functionality
- Priority badges (Low/Medium/High)
- Archive functionality

#### **AccountModal.tsx**
- Password change
- User information view
- Logout functionality

#### **AchievementModal.tsx**
- Achievement visualization
- Progress tracking
- Unlocked/Locked states

#### **HistoryDrawer.tsx**
- Chronological change history
- Task archive
- Restore functionality

---

## 🎯 Features

### 1. **Task Management**
- Create tasks with details (title, description, date, priority)
- Change status (Todo → In Progress → Done)
- Drag & Drop reordering
- Colors for organization
- Archive system

### 2. **Time Tracking**
- Start/stop timer per task
- Automatic time tracking
- Visualization of total time
- Time persists after logout

### 3. **Achievement System**
Automatically unlocked achievements:
- 🎯 **First Task** - Create your first task
- ✅ **Task Master** - Complete 10 tasks
- 🏆 **Achievement Hunter** - Collect 5 achievements
- 🔥 **Streak Master** - Work 7 days in a row
- ⏱️ **Time Warrior** - 10 hours of time tracking

### 4. **Search & Filter**
- Search by title and description
- Filter by status (All/Active/Completed)
- Real-time search

### 5. **Theme Support**
- Light mode
- Dark mode
- Persistent across sessions (localStorage)

### 6. **Authentication & Security**
- JWT token-based auth
- Password hashing (ASP.NET Identity)
- Protected API endpoints
- Auto token refresh via interceptor

---

## 🌐 Hosting

### Single-Port Architecture
The project is configured to work from **one port** (5202), where the backend serves both the API and React frontend.

### Deployment Process:

1. **Build frontend:**
   ```bash
   cd TaskFlow.Web
   npm run build
   ```

2. **Copy to backend:**
   ```bash
   xcopy /E /I /Y dist\* ..\TaskFlow.API\wwwroot\
   ```

3. **Run backend:**
   ```bash
   cd TaskFlow.API
   dotnet run
   ```

4. **Expose with ngrok:**
   ```bash
   ngrok http 5202
   ```

**Or use the ready-made script:**
```bash
build-and-run.bat
```

---

## ⚙️ Configuration

### Backend (`appsettings.json`)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=taskflow.db"
  },
  "Jwt": {
    "Key": "your-super-secret-jwt-key-at-least-32-characters-long",
    "Issuer": "TaskFlowAPI",
    "Audience": "TaskFlowClient"
  }
}
```

### Frontend (`.env`)
```env
VITE_API_URL=/api
```
*(Relative path because frontend is served from backend)*

### Important Files:

- **Program.cs** - Backend configuration, middleware setup
- **vite.config.ts** - Build configuration, dev server
- **tailwind.config.js** - Tailwind CSS customization
- **build-and-run.bat** - Deployment automation

---

## 📦 Dependencies

### Backend
```xml
<PackageReference Include="MediatR" Version="12.0.0" />
<PackageReference Include="Microsoft.EntityFrameworkCore.Sqlite" Version="8.0.0" />
<PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="8.0.0" />
<PackageReference Include="Swashbuckle.AspNetCore" Version="6.5.0" />
```

### Frontend
```json
{
  "react": "^18.2.0",
  "typescript": "^5.2.2",
  "vite": "^5.1.4",
  "tailwindcss": "^3.4.1",
  "framer-motion": "^12.29.0",
  "@dnd-kit/core": "^6.3.1",
  "axios": "^1.6.7"
}
```

---

## 🚀 Running the Project

### Local Development:

**Terminal 1 - Backend:**
```bash
cd TaskFlow.API
dotnet run
```

**Terminal 2 - Frontend:**
```bash
cd TaskFlow.Web
npm run dev
```

### Production (Single Port):
```bash
build-and-run.bat
```

---

## 📝 Notes

- **Database:** SQLite file (`taskflow.db`) is created automatically
- **Migrations:** Applied automatically on backend startup
- **CORS:** Configured as "AllowAll" for development
- **Static files:** Frontend served from `wwwroot` folder in backend
- **SPA routing:** All unknown routes redirect to `index.html`

---

## 🔐 Security Best Practices

1. **JWT Secret:** Change `Jwt:Key` in production
2. **CORS:** Restrict origins in production
3. **HTTPS:** Use HTTPS in production (ngrok does this automatically)
4. **Password:** Minimum 6 characters (can be increased)
5. **Tokens:** Stored in browser localStorage

---

## 📧 API Response Formats

### Success Response:
```json
{
  "id": "guid",
  "title": "Task title",
  "status": "InProgress",
  ...
}
```

### Error Response:
```json
{
  "message": "Error description",
  "errors": ["Detailed error 1", "Detailed error 2"]
}
```

### Authentication Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

*This document covers the entire architecture and functionality of the TaskFlow project.*
