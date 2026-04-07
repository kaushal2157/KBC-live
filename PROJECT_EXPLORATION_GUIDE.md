# 🎬 KBC-WEB Project Exploration Guide

Welcome! This guide will help you understand, navigate, and work with the KBC-WEB application.

---

## 📋 Table of Contents

1. [What is This Project?](#what-is-this-project)
2. [Quick Start](#quick-start)
3. [Project Architecture](#project-architecture)
4. [Explore by Role](#explore-by-role)
5. [Key Features](#key-features)
6. [File Structure & Navigation](#file-structure--navigation)
7. [Technology Stack](#technology-stack)
8. [Documentation Map](#documentation-map)
9. [Common Tasks](#common-tasks)

---

## 🎥 What is This Project?

**KBC-WEB** is an Angular-based web application that replicates the game show "Kaun Banega Crorepati" (Who Wants to Be a Millionaire). 

### Key Characteristics:
- ✅ Quiz game with multiple questions and scoring
- ✅ Contestant management and tracking
- ✅ Role-based branding and customization
- ✅ Secure access control with authentication
- ✅ Modern Angular (v19) with Tailwind CSS
- ✅ 100% tested authentication system

---

## 🚀 Quick Start

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start the Application
```bash
npm start
```
The app will be available at `http://localhost:4200`

### Step 3: Login
- **Username**: `client`
- **Password**: `client@123`

### Step 4: Explore!
Once logged in, you can access:
- 🏠 **Home** - Dashboard and welcome screen
- 🎯 **Quiz** - Take the quiz or select from quiz list
- 👥 **Contestants List** - View all contestants
- ⚙️ **Settings** - User/role configuration

---

## 📐 Project Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────┐
│          Angular Application (v19)              │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │      Routing Layer (app.routes.ts)       │  │
│  │  ├─ /access-login (public)               │  │
│  │  ├─ / (protected)                        │  │
│  │  ├─ /welcome (protected)                 │  │
│  │  ├─ /quiz (protected)                    │  │
│  │  └─ /contestents-list (protected)        │  │
│  └────────────────┬─────────────────────────┘  │
│                   │                             │
│  ┌────────────────▼─────────────────────────┐  │
│  │     Authentication Guard Layer            │  │
│  │  - authGuard checks if user logged in    │  │
│  │  - Protects all routes except login      │  │
│  └────────────────┬─────────────────────────┘  │
│                   │                             │
│  ┌────────────────▼─────────────────────────┐  │
│  │      Components & Services               │  │
│  │  ├─ Pages (home, quiz, etc.)             │  │
│  │  ├─ Services (auth, questions, roles)    │  │
│  │  └─ Models (Contestant, Question)        │  │
│  └────────────────┬─────────────────────────┘  │
│                   │                             │
│  ┌────────────────▼─────────────────────────┐  │
│  │   Data & Storage                         │  │
│  │  ├─ localStorage (persistent auth)       │  │
│  │  ├─ In-memory state (RxJS)               │  │
│  │  └─ Static files (questions.json)        │  │
│  └─────────────────────────────────────────┘  │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Core Layers

| Layer | Purpose | Key Files |
|-------|---------|-----------|
| **Routing** | Maps URLs to components | `app.routes.ts`, `app.component.ts` |
| **Authentication** | Manages login & protection | `auth/` folder, `auth.guard.ts` |
| **Pages** | User-facing components | `pages/` folder |
| **Services** | Business logic | `services/` folder |
| **Models** | Data structures | `models/` folder |
| **Styling** | UI/UX | Tailwind CSS, component CSS files |

---

## 👥 Explore by Role

### � End User (Just Using the App)
**Start Here**: [END_USER_GUIDE.md](END_USER_GUIDE.md) (3 min)
- How to log in
- How to take the quiz
- How to log out
- FAQ and tips

### �👨‍💼 Project Manager / Product Owner
**Start Here**: [COMPLETION_REPORT.md](COMPLETION_REPORT.md) (3 min)
- What's been implemented
- Test results
- Feature checklist

**Then Read**: [VISUAL_GUIDE.md](VISUAL_GUIDE.md) (10 min)
- See flow diagrams
- Understand the big picture

### 👨‍💻 Frontend Developer
**Start Here**: [AUTH_QUICKSTART.md](AUTH_QUICKSTART.md) (5 min)
- Quick setup
- File structure
- Common dev tasks

**Then Read**: [CODE_REFERENCE.md](CODE_REFERENCE.md) (20 min)
- Complete code listings
- Code patterns
- Integration examples

**Finally**: [AUTH_IMPLEMENTATION.md](AUTH_IMPLEMENTATION.md) (15 min)
- Architecture details
- Customization guide
- Security considerations

### 🧪 QA / Tester
**Start Here**: [AUTH_QUICKSTART.md#for-users-testers](AUTH_QUICKSTART.md) (5 min)
- How to log in
- What to test

**Then Read**: [VERIFICATION_CHECKLIST.md](VERIFICATION_CHECKLIST.md)
- Complete test checklist
- All test cases

### 🎓 Student / Learning
**Start Here**: [VISUAL_GUIDE.md](VISUAL_GUIDE.md) (10 min)
- Flow diagrams help understand the big picture

**Then Read**: [AUTH_IMPLEMENTATION.md](AUTH_IMPLEMENTATION.md) (15 min)
- Detailed explanations
- How everything works

**Finally**: [CODE_REFERENCE.md](CODE_REFERENCE.md) (20 min)
- See actual code
- Learn patterns

---

## ✨ Key Features

### 1. **Authentication & Access Control**
- User login with credentials
- Session persistence (localStorage)
- Logout functionality
- Route guards on protected routes

```typescript
// Example: AuthGuard protects routes
canActivate(route, state) {
  if (this.authService.isAuthenticated()) {
    return true; // Allow access
  }
  this.router.navigate(['/access-login']);
  return false; // Deny access
}
```

### 2. **Quiz System**
- Multiple questions with answers
- Score tracking
- Question randomization
- Quiz completion status

**Base Files**: `src/app/services/questions.service.ts`, `src/app/pages/quiz/`

### 3. **Contestant Management**
- View list of contestants
- Contestant details
- Score tracking

**Base Files**: `src/app/pages/contestents-list/`, `src/app/models/contestent.model.ts`

### 4. **Role-Based Branding**
- Different UI for different roles
- Customizable styling per role
- Role context service

**Base Files**: `src/app/services/role-context.service.ts`, `src/app/services/role-branding.config.ts`

### 5. **Responsive Design**
- Mobile-friendly using Tailwind CSS
- Works on desktop and tablet
- Adaptive layouts

---

## 📁 File Structure & Navigation

```
src/app/                     ← Main application code
├── auth/                    ← Authentication system
│   ├── config/
│   │   └── auth.config.ts   ← Hardcoded credentials (simple setup)
│   ├── services/
│   │   ├── auth.service.ts  ← Login/logout logic
│   │   └── *.spec.ts        ← Tests
│   ├── guards/
│   │   └── auth.guard.ts    ← Route protection
│   └── pages/
│       └── access-login/    ← Login form UI
│
├── pages/                   ← Application pages
│   ├── home/                ← Home/dashboard
│   ├── quiz/                ← Quiz taking
│   ├── contestents-list/    ← Contestant listing
│   ├── welcome-page/        ← Welcome screen
│   └── quiz-result/         ← Results display
│
├── services/                ← Business logic
│   ├── questions.service.ts ← Quiz questions
│   ├── role-context.service.ts ← User role management
│   └── role-branding.config.ts ← UI customization
│
├── models/                  ← Data types
│   ├── question.model.ts    ← Question structure
│   └── contestent.model.ts  ← Contestant structure
│
├── assets/                  ← Static files
│   ├── data/
│   │   ├── questions.json   ← Quiz questions data
│   │   └── tigerQuestions.json ← Alternative questions
│   ├── logos/              ← Brand logos
│   └── sounds/             ← Audio files
│
├── app.routes.ts            ← URL routing configuration
├── app.config.ts            ← Application config
└── app.component.ts         ← Root component
```

### How to Navigate:
- **Want to understand login?** → `src/app/auth/`
- **Want to add a new page?** → `src/app/pages/`
- **Want to add a new service?** → `src/app/services/`
- **Want to change questions?** → `src/app/assets/data/questions.json`
- **Want to understand routing?** → `src/app/app.routes.ts`

---

## 🛠 Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Angular** | 19.2.0 | Frontend framework |
| **TypeScript** | 5.7.2 | Language |
| **RxJS** | 7.8.0 | Reactive programming |
| **Tailwind CSS** | 4.1.12 | Styling |
| **GSAP** | 3.14.2 | Animations |
| **Karma** | 6.4.0 | Test runner |
| **Jasmine** | 5.6.0 | Test framework |

### Why These Choices?
- **Angular** - Full-featured framework, built-in routing & DI
- **RxJS** - Reactive state management
- **Tailwind** - Rapid UI development
- **GSAP** - Smooth animations for quiz UI
- **Jasmine/Karma** - Angular standard testing tools

---

## 📚 Documentation Map

Read the docs in this order based on your goal:

### 🎯 Goal: "I just want to use the app"
1. [END_USER_GUIDE.md](END_USER_GUIDE.md) - How to login and take quiz (3 min)

### 🎯 Goal: "I just want to run it and test it"
1. This file (PROJECT_EXPLORATION_GUIDE.md) - **you are here**
2. [AUTH_QUICKSTART.md](AUTH_QUICKSTART.md) - 2 minutes

### 🎯 Goal: "I want to understand the code"
1. [VISUAL_GUIDE.md](VISUAL_GUIDE.md) - Flow diagrams (10 min)
2. [AUTH_IMPLEMENTATION.md](AUTH_IMPLEMENTATION.md) - Details (15 min)
3. [CODE_REFERENCE.md](CODE_REFERENCE.md) - Actual code (20 min)

### 🎯 Goal: "I need to modify something"
1. [CODE_REFERENCE.md](CODE_REFERENCE.md) - See patterns (20 min)
2. [AUTH_IMPLEMENTATION.md](AUTH_IMPLEMENTATION.md) - Understand architecture (15 min)
3. Look at component files directly in VS Code

### 🎯 Goal: "I need to test everything"
1. [AUTH_QUICKSTART.md](AUTH_QUICKSTART.md) - Quick testing (5 min)
2. [VERIFICATION_CHECKLIST.md](VERIFICATION_CHECKLIST.md) - Complete checklist
3. Run: `npm test`

### 🎯 Goal: "I'm a complete beginner"
1. **This file** - Get oriented
2. [VISUAL_GUIDE.md](VISUAL_GUIDE.md) - See how it flows
3. [AUTH_QUICKSTART.md](AUTH_QUICKSTART.md) - Run & test
4. [CODE_REFERENCE.md](CODE_REFERENCE.md) - Read actual code
5. [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - See architecture

---

## 📝 Common Tasks

### Task: "Run the application"
```bash
npm start
# Opens http://localhost:4200
# Login with: client / client@123
```

### Task: "Run tests"
```bash
npm test
# Runs all tests with Karma
```

### Task: "Build for production"
```bash
ng build
```

### Task: "Change login credentials"
1. Open `src/app/auth/config/auth.config.ts`
2. Change `validUsername` and `validPassword`
3. Restart `npm start`

### Task: "Add a new page"
1. Create folder: `src/app/pages/my-page/`
2. Generate component: `ng generate component pages/my-page`
3. Add route to `src/app/app.routes.ts`
4. Add AuthGuard protection if needed

### Task: "Add a new quiz question"
1. Open `src/app/assets/data/questions.json`
2. Add new question object to array
3. Restart `npm start`

### Task: "Change styling"
- Use Tailwind CSS classes in template HTML
- Edit `src/app/pages/*/component.css` for component-specific styles
- Edit `src/styles.css` for global styles

### Task: "Debug authentication issues"
1. Check localStorage in browser DevTools
2. Check browser console for errors
3. Look at `auth.service.ts` for logic
4. Read [CODE_REFERENCE.md](CODE_REFERENCE.md) for patterns

---

## 🎓 Learning Path

If you're new to Angular or this codebase, follow this path:

```
1. Run the app (Step 1-3 of Quick Start above)
2. Click around the UI, get familiar ✨
3. Read VISUAL_GUIDE.md (see flow diagrams)
4. Read AUTH_QUICKSTART.md (understand structure)
5. Read small files: models, config
6. Read service files (auth.service.ts, questions.service.ts)
7. Read component files (home, quiz, login)
8. Look at app.routes.ts (understand routing)
9. Look at app.component.ts (understand root)
10. Read full AUTH_IMPLEMENTATION.md (deep dive)
```

---

## ❓ FAQ - Quick Answers

**Q: How is authentication implemented?**
A: Simple credential checking in [auth.config.ts](src/app/auth/config/auth.config.ts). For production, replace with real backend authentication.

**Q: How are protected routes working?**
A: The `authGuard` checks `localStorage` for auth flag. If missing, redirects to login.

**Q: Where are quiz questions stored?**
A: Two files: `src/app/assets/data/questions.json` and `public/tigerQuestions.json`

**Q: How do I add persistence to contestant scores?**
A: Currently in-memory. To persist, save to localStorage or backend in `questions.service.ts`.

**Q: Can I customize the styling?**
A: Yes! Use Tailwind classes in templates or edit component `.css` files.

**Q: How do I run tests?**
A: `npm test` - See [VERIFICATION_CHECKLIST.md](VERIFICATION_CHECKLIST.md) for what's tested

**Q: Is this production-ready?**
A: The authentication and basic features are tested and working. Backend integration needed for production.

---

## 📞 Need More Help?

- **Using the App?** → [END_USER_GUIDE.md](END_USER_GUIDE.md)
- **Setup Issues?** → [AUTH_QUICKSTART.md](AUTH_QUICKSTART.md)
- **Code Questions?** → [CODE_REFERENCE.md](CODE_REFERENCE.md)
- **How it Works?** → [VISUAL_GUIDE.md](VISUAL_GUIDE.md)
- **Technical Details?** → [AUTH_IMPLEMENTATION.md](AUTH_IMPLEMENTATION.md)
- **Architecture?** → [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)
- **Testing?** → [VERIFICATION_CHECKLIST.md](VERIFICATION_CHECKLIST.md)

---

## 🎉 Next Steps

1. **Run the app** following the Quick Start section
2. **Pick a role** from "Explore by Role" section
3. **Read the recommended docs** for your role
4. **Explore the code** in VS Code
5. **Try a common task** from the Common Tasks section

Happy exploring! 🚀
