# Quick Start Guide - Authentication System

## What's New?

The KBC application now has a basic access control layer. Users must log in before accessing the application.

---

## For Users/Testers

### How to Access the Application

1. **Start the application**:
   ```bash
   npm start
   ```

2. **Navigate to** `http://localhost:4200`

3. **You'll see the Login Page**:
   - Enter Username: `client`
   - Enter Password: `client@123`
   - Click "Access Application"

4. **Once logged in**:
   - Access all normal application features
   - Click "Logout" button (top-right) to exit

### Session Persistence

- Your session persists if you refresh the page
- Closing the browser also keeps you logged in
- Only logging out via the "Logout" button clears access

---

## For Developers

### File Structure

```
src/app/auth/
├── config/
│   └── auth.config.ts              ← Update credentials here
├── services/
│   ├── auth.service.ts             ← Core authentication logic
│   └── auth.service.spec.ts        ← Service tests
├── guards/
│   └── auth.guard.ts               ← Route protection
└── pages/
    └── access-login/
        ├── access-login.component.ts
        ├── access-login.component.html
        ├── access-login.component.css
        └── access-login.component.spec.ts
```

### Quick File Reference

| File | Purpose |
|------|---------|
| `auth.config.ts` | Stores credentials (client/client@123) |
| `auth.service.ts` | Manages login state & localStorage |
| `auth.guard.ts` | Protects routes using canActivate |
| `access-login/*` | Login form UI |

### Development Tasks

#### Change Login Credentials

1. Edit `src/app/auth/config/auth.config.ts`
2. Update `validUsername` and `validPassword`
3. Restart `npm start`

#### Add Authentication to a New Route

In `src/app/app.routes.ts`:

```typescript
{
  path: 'my-page',
  component: MyComponent,
  canActivate: [authGuard]  // ← Add this line
}
```

#### Check Authentication Status in a Component

```typescript
import { AuthService } from './auth/services/auth.service';

export class MyComponent {
  constructor(private authService: AuthService) {}

  // In template
  isAuthenticated = this.authService.isAuthenticated$;
  
  logout() {
    this.authService.logout();
  }
}
```

#### Run Tests

```bash
npm test
```

---

## Key Implementation Details

### 1. Routes Are Protected

All main routes (`/`, `/welcome`, `/quiz`, etc.) require authentication. Unauthenticated requests redirect to `/access-login`.

### 2. State Stored in localStorage

After login, a flag `kbc_access_granted` is stored in localStorage. This persists the session across page refreshes.

### 3. Observable Pattern

The AuthService uses RxJS Observables to emit authentication state changes. Subscribe in components:

```typescript
isAuthenticated$ = this.authService.isAuthenticated$;
```

Use in template:

```html
<div *ngIf="isAuthenticated$ | async">
  User is logged in
</div>
```

### 4. No Backend Required

Everything runs client-side. No API calls, no server validation.

---

## Common Scenarios

### Scenario: User refreshes the page
- ✅ User stays logged in (localStorage flag persists)
- User is not redirected to login

### Scenario: User navigates to `/quiz` without logging in
- ❌ User is NOT allowed
- AuthGuard redirects to `/access-login`

### Scenario: User clicks "Logout"
- ✅ localStorage is cleared
- AppComponent redirects to `/access-login`
- User must log in again

### Scenario: User opens DevTools and deletes localStorage
- ❌ Next navigation check fails
- User is redirected to login page

---

## Customization Examples

### Change Styling

Login page CSS: `src/app/auth/pages/access-login/access-login.component.css`

Logout button CSS: `src/app/app.component.css`

### Change Validation Rules

Edit `access-login.component.ts`:

```typescript
// Make password required to be at least 8 characters
password: ['', [Validators.required, Validators.minLength(8)]]
```

### Show "Admin Panel" Only to Authenticated Users

```html
<nav *ngIf="isAuthenticated$ | async">
  <a routerLink="/admin">Admin</a>
</nav>
```

---

## Troubleshooting

### Issue: "Page keeps redirecting to login"

**Solution**: Clear localStorage and try again
```javascript
// In browser console
localStorage.clear();
// Refresh the page
```

### Issue: "Old credentials still work after changing config"

**Solution**: Clear localStorage
```javascript
localStorage.removeItem('kbc_access_granted');
```

### Issue: "Build fails with TypeScript errors"

**Solution**: Run these commands
```bash
npm install
ng build --configuration development
```

---

## Testing the Authentication

### Manual Testing Checklist

- [ ] Visit `/access-login` without credentials → should see login form
- [ ] Enter wrong credentials → should see "Invalid username or password"
- [ ] Enter correct credentials (`client` / `client@123`) → should navigate to `/`
- [ ] Refresh page → should still be logged in
- [ ] Click "Logout" button → should redirect to `/access-login`
- [ ] Try to manually navigate to protected route (`/quiz`) → should redirect to login if logged out

### Automated Testing

```bash
npm test
```

Tests include:
- Authentication with valid/invalid credentials
- localStorage persistence
- Observable emission
- Component form validation
- Login flow

---

## Performance

- **No performance impact**: Runs entirely client-side
- **Bundle size**: ~2KB additional code
- **Startup time**: No additional delay

---

## Security Reminder

⚠️ **For Internal/Demo Use Only**

This authentication system is designed for client delivery and internal demos. It is NOT suitable for production because:
- Credentials are visible in code
- No backend validation
- No password hashing
- No encryption

For production, implement proper OAuth/authentication with a backend.

---

## Support

For detailed technical documentation, see [AUTH_IMPLEMENTATION.md](AUTH_IMPLEMENTATION.md)

For component-specific code comments, refer to the inline JSDoc comments in each TypeScript file.
