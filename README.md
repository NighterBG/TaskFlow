# 🚀 TaskFlow

**TaskFlow** is a premium, boutique task management application designed for focus and productivity. Built with a modern .NET 8 API and a high-performance React frontend, it features real-time search, drag-and-drop organization, and a gamified achievement system.

## ✨ Key Features

- 🔍 **Boutique Search**: Lightning-fast, multi-word matching for your tasks.
- 🏆 **Gamification**: Earn badges like *"Seed Sower"* and *"Librarian"* as you work.
- 📦 **Archiving & History**: Sweep away completed tasks into a premium history drawer.
- 🎨 **Dynamic Styling**: Beautifully animated UI with custom task colors and light/dark modes.
- 🕰️ **Time Tracking**: Live timers to monitor your productivity in real-time.
- 👆 **Drag & Drop**: Intuitively reorder your priorities with smooth dnd-kit mechanics.

## 🛠️ Technology Stack

- **Frontend**: React, TypeScript, Vite, Framer Motion, Lucide Icons, dnd-kit.
- **Backend**: .NET 8, Entity Framework Core, PostgreSQL (with Npgsql FTS).
- **Authentication**: ASP.NET Core Identity.

## 🚀 Getting Started

### Prerequisites
- .NET 8 SDK
- Node.js & npm
- PostgreSQL

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/TaskFlow.git
   cd TaskFlow
   ```

2. **Setup the Database**:
   Update `appsettings.json` in `TaskFlow.API` with your connection string, then run:
   ```bash
   dotnet ef database update --project TaskFlow.Infrastructure --startup-project TaskFlow.API
   ```

3. **Run the Backend**:
   ```bash
   cd TaskFlow.API
   dotnet run
   ```

4. **Run the Frontend**:
   ```bash
   cd ../TaskFlow.Web
   npm install
   npm run dev
   ```

---
Built with ❤️ by NighterBG.
