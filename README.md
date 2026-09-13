# Aptus Enterprise Web App

This project is a modern, enterprise-grade React application designed with a Java Spring Boot MVC-inspired architecture. It provides a solid foundation for scaling, integrating with backend services, and managing complex business logic efficiently on the frontend.

## 🏗️ Architecture

To ease the transition and mental model for Java/Spring Boot developers, the frontend directory structure closely maps to traditional MVC patterns:

```
src/
├── config/           # Application Configuration (Firebase, i18n, Themes) -> Maps to Spring Config / Security
├── controllers/      # State Management & Flow (Contexts, React hooks for logic) -> Maps to @RestController
├── services/         # Business Logic Layer (API endpoints abstraction) -> Maps to @Service
├── repositories/     # Data Access Layer (Direct DB/Firebase calls) -> Maps to @Repository
├── models/           # Types and Interfaces (DTOs and Entities) -> Maps to @Entity / DTOs
├── exceptions/       # Global Error Handling -> Maps to @ControllerAdvice
├── views/            # Main Page Components -> Maps to Views
├── components/       # Reusable UI Elements (Buttons, Modals, Navbars)
└── layouts/          # High-level Structural Wrappers (Header, Footer, Main container)
```

## 🔐 Secure Login & Role Management

The application features a secure, full-stack authentication flow using Firebase Auth & Firestore:

1. **Authentication**: Users can log in via Google OAuth or Email/Password.
2. **Profile & Role Persistence**: Upon successful authentication, the `AppContext` controller checks the `users` collection in the database.
   - If the user exists, their role is pulled from the DB.
   - If the user is new, a profile is created in the DB with the default `member` role.
   - *Special Case*: Users logging in with `admin@aptus.com` or `hesamasadinezhad@gmail.com` are automatically assigned the `manager` role upon creation.
3. **Manager Dashboard**: The floating `RoleSwitcher` component has been refactored into a **Manager Dashboard**. 
   - It is *only* visible to users with the `manager` role.
   - It queries all users from the database and allows the manager to dynamically change the roles of other users (Guest, Member, Admin, Manager).
   - These changes are securely persisted back to the database via the `FirebaseRepository`.

## 🔌 Connecting to a Pure Java Backend

Currently, the application relies on Firebase for rapid prototyping and cloud persistence. However, the architecture is specifically designed to swap Firebase out for a pure Java backend (e.g., Spring Boot + PostgreSQL) with minimal effort:

1. Look at `src/repositories/FirebaseRepository.ts`.
2. Right now, it executes `getDoc` and `setDoc` against Firestore.
3. When your Java API is ready, simply replace the Firebase imports and functions with HTTP clients like `fetch` or `axios`:

```typescript
// Future: src/repositories/ApiRepository.ts
export const ApiRepository = {
  getDocument: async (endpoint: string, id: string) => {
    const res = await fetch(`https://api.aptus.com/${endpoint}/${id}`);
    return await res.json();
  },
  saveDocument: async (endpoint: string, id: string, data: any) => {
    await fetch(`https://api.aptus.com/${endpoint}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }
}
```

Because `src/services/api.ts` acts as a middleman, your UI components won't even know the underlying database changed!

## 🚀 Running the Project

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```
