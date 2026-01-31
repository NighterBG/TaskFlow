# 📋 TaskFlow - Пълна Документация на Проекта

*Версия 1.0 | Януари 2026*

---

## 📖 Съдържание

1. [Обща информация](#обща-информация)
2. [Архитектура](#архитектура)
3. [Технологии](#технологии)
4. [База данни](#база-данни)
5. [Backend (API)](#backend-api)
6. [Frontend](#frontend)
7. [Функционалности](#функционалности)
8. [Хостинг](#хостинг)
9. [Конфигурация](#конфигурация)

---

## 🎯 Обща информация

**TaskFlow** е модерна full-stack задача management система с богати функционалности за време tracking, постижения, и красив потребителски интерфейс.

### Основни характеристики:
- ✅ CRUD операции за задачи
- ⏱️ Time tracking с timer функционалност
- 🏆 Система за постижения (achievements)
- 📊 История на промените
- 🎨 Dark/Light mode
- 🔐 JWT Authentication
- 📱 Responsive дизайн
- 🌐 Хостинг готова конфигурация

---

## 🏗️ Архитектура

Проектът следва **Clean Architecture** принципите с ясно разделение на слоевете:

```
TaskFlow/
├── TaskFlow.API          # Presentation Layer (ASP.NET Web API)
├── TaskFlow.Application  # Business Logic Layer (CQRS/MediatR)
├── TaskFlow.Domain       # Domain Layer (Entities, Enums)
├── TaskFlow.Infrastructure # Data Access Layer (EF Core, Services)
├── TaskFlow.Web          # Frontend (React + TypeScript + Vite)
└── TaskFlow.Tests        # Unit Tests
```

### Patterns използвани:
- **CQRS** - Command Query Responsibility Segregation
- **MediatR** - Mediator pattern за команди и заявки
- **Repository Pattern** - Абстракция на data access
- **Dependency Injection** - За loose coupling

---

## 💻 Технологии

### Backend (.NET 8)
- **ASP.NET Core 8.0** - Web API framework
- **Entity Framework Core** - ORM за база данни
- **MediatR** - CQRS implementation
- **JWT Bearer Authentication** - За security
- **SQLite** - База данни (лесна за deploy)
- **Swagger** - API документация

### Frontend (React 18)
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool (бърз dev server)
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Анимации
- **React Router** - Client-side routing
- **Axios** - HTTP клиент
- **Lucide React** - Икони

---

## 🗄️ База данни

### Таблици (Entities):

#### 1. **TaskItem** - Задачи
```
- Id (Guid) - Уникален идентификатор
- Title (string) - Заглавие на задачата
- Description (string) - Описание
- DueDate (DateTime?) - Краен срок
- Priority (enum) - Low/Medium/High
- Status (enum) - Todo/InProgress/Done
- Color (string) - Цвят на задачата
- Order (int) - Ред в списъка
- TimeSpentSeconds (long) - Време похарчено
- TrackingStartedAt (DateTime?) - Начало на timer
- IsArchived (bool) - Архивирана ли е
- ArchivedAt (DateTime?) - Кога е архивирана
- UserId (string) - Собственик
- CreatedAt (DateTime) - Създадена на
- UpdatedAt (DateTime) - Обновена на
```

#### 2. **AppUser** - Потребители
```
- Id (string) - User ID от ASP.NET Identity
- Username (string) - Потребителско име
- PasswordHash (string) - Хеширана парола
- CreatedAt (DateTime) - Дата на регистрация
```

#### 3. **Achievement** - Постижения
```
- Id (Guid) - Уникален идентификатор
- Name (string) - Име на постижението
- Description (string) - Описание
- Icon (string) - Икона
- Threshold (int) - Условие за отключване
```

#### 4. **UserAchievement** - Връзка потребител-постижения
```
- Id (Guid) - Уникален идентификатор
- UserId (string) - Потребител
- AchievementId (Guid) - Постижение
- UnlockedAt (DateTime) - Кога е отключено
```

---

## 🔌 Backend (API)

### API Endpoints:

#### **Auth Controller** (`/api/auth`)
- `POST /login` - Влизане в системата
- `POST /register` - Регистрация
- `POST /change-password` - Смяна на парола [Auth Required]

#### **Tasks Controller** (`/api/tasks`)
- `GET /` - Всички задачи на текущия потребител [Auth]
- `POST /` - Създай нова задача [Auth]
- `PUT /{id}` - Обнови задача [Auth]
- `DELETE /{id}` - Изтрий задача [Auth]
- `POST /search` - Търси задачи [Auth]
- `PATCH /{id}/status` - Обнови статус [Auth]
- `POST /{id}/toggle-timer` - Старт/стоп timer [Auth]
- `POST /{id}/archive` - Архивирай задача [Auth]
- `PATCH /{id}/reorder` - Промени реда [Auth]

#### **Achievements Controller** (`/api/achievements`)
- `GET /available` - Налични постижения [Auth]
- `GET /user` - Постижения на потребителя [Auth]

### CQRS Commands & Queries:

**Commands (промяна на състоянието):**
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

**Queries (четене на данни):**
- `GetAllTasksQuery`
- `SearchTasksQuery`
- `GetAvailableAchievementsQuery`
- `GetUserAchievementsQuery`

---

## 🎨 Frontend

### Структура на компонентите:

```
src/
├── pages/
│   ├── Login.tsx          # Страница за влизане
│   ├── Register.tsx       # Страница за регистрация
│   └── Tasks.tsx          # Главна задача страница
├── components/
│   ├── AccountModal.tsx   # Модал с account настройки
│   ├── AchievementModal.tsx # Модал с постижения
│   ├── HistoryDrawer.tsx  # История на промените
│   ├── ThemeProvider.tsx  # Dark/Light mode
│   └── UserMenu.tsx       # Потребителско меню
├── lib/
│   └── api.ts             # Axios instance с JWT
├── App.tsx                # Main app component
└── main.tsx               # Entry point
```

### Ключови функции:

#### **Tasks.tsx** - Основната страница
- Drag & Drop за reordering (dnd-kit)
- Inline редактиране на задачи
- Time tracking с visual timer
- Филтри (All/Active/Completed)
- Search функционалност
- Priority badges (Low/Medium/High)
- Archive функционалност

#### **AccountModal.tsx**
- Смяна на парола
- View на потребителска информация
- Logout функционалност

#### **AchievementModal.tsx**
- Визуализация на постижения
- Progress tracking
- Unlocked/Locked състояния

#### **HistoryDrawer.tsx**
- Хронологична история на промените
- Archive на задачи
- Restore функционалност

---

## 🎯 Функционалности

### 1. **Задача Management**
- Създаване на задачи с детайли (заглавие, описание, дата, приоритет)
- Променяне на статус (Todo → In Progress → Done)
- Drag & Drop reordering
- Цветове за organization
- Archive система

### 2. **Time Tracking**
- Старт/стоп timer per задача
- Автоматично проследяване на времето
- Визуализация на общото време
- Time остава след logout

### 3. **Система за постижения**
Автоматично отключвани постижения:
- 🎯 **First Task** - Създай първата си задача
- ✅ **Task Master** - Завърши 10 задачи
- 🏆 **Achievement Hunter** - Събери 5 постижения
- 🔥 **Streak Master** - Работи 7 дни подред
- ⏱️ **Time Warrior** - 10 часа time tracking

### 4. **Search & Filter**
- Търсене по заглавие и описание
- Филтриране по статус (All/Active/Completed)
- Real-time search

### 5. **Theme Support**
- Light mode
- Dark mode
- Persistent през сесии (localStorage)

### 6. **Authentication & Security**
- JWT token-based auth
- Password hashing (ASP.NET Identity)
- Protected API endpoints
- Auto token refresh via interceptor

---

## 🌐 Хостинг

### Single-Port Architecture
Проектът е конфигуриран да работи от **един порт** (5202), където backend сървира и React frontend-a.

### Deployment процес:

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

**Или използвай готовия скрипт:**
```bash
build-and-run.bat
```

---

## ⚙️ Конфигурация

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
*(Relative path защото frontend се сървира от backend)*

### Важни файлове:

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

## 🚀 Стартиране на проекта

### Локално development:

**Терминал 1 - Backend:**
```bash
cd TaskFlow.API
dotnet run
```

**Терминал 2 - Frontend:**
```bash
cd TaskFlow.Web
npm run dev
```

### Production (Single Port):
```bash
build-and-run.bat
```

---

## 📝 Бележки

- **База данни:** SQLite файл (`taskflow.db`) се създава автоматично
- **Migrations:** Прилагат се автоматично при стартиране на backend
- **CORS:** Конфигуриран е "AllowAll" за development
- **Static files:** Frontend се сървира от `wwwroot` folder в backend
- **SPA routing:** Всички неизвестни routes се redirect-ват към `index.html`

---

## 🔐 Security Best Practices

1. **JWT Secret:** Смени `Jwt:Key` в production
2. **CORS:** Ограничи origins в production
3. **HTTPS:** Използвай HTTPS в production (ngrok го прави автоматично)
4. **Password:** Минимум 6 символа (може да се увеличи)
5. **Tokens:** Съхраняват се в browser localStorage

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

*Този документ покрива цялата архитектура и функционалност на TaskFlow проекта.*
