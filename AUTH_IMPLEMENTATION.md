# Authentication & Access Control System

## Overview

This is a lightweight, client-side access protection layer for the KBC application. It provides basic username/password gating without backend authentication or password hashing.

⚠️ **Important**: This is basic access control only, not a production authentication system. Credentials are visible to users and stored in localStorage for client-delivery scenarios.

---

## Architecture

### File Structure

```
src/app/auth/
├── config/
│   └── auth.config.ts          # Credentials configuration
├── services/
│   ├── auth.service.ts         # Authentication state management
│   └── auth.service.spec.ts    # Service tests
├── guards/
│   └── auth.guard.ts           # Route protection guard
└── pages/
    └── access-login/
        ├── access-login.component.ts
        ├── access-login.component.html
        ├── access-login.component.css
        └── access-login.component.spec.ts
```

### Key Components

#### 1. **AuthService** (`auth.service.ts`)
Manages authentication state and localStorage persistence.

**Methods:**
- `authenticate(username: string, password: string): boolean` - Validates credentials
- `getIsAuthenticated(): boolean` - Returns current auth status
- `logout(): void` - Clears authentication
- `isAuthenticated$: Observable<boolean>` - Auth state stream

**Features:**
- RxJS Observable for reactive auth state
- localStorage persistence with key: `kbc_access_granted`
- No backend calls

#### 2. **AuthGuard** (`auth.guard.ts`)
Route protection using Angular's `CanActivateFn`.

**Behavior:**
- Allows navigation if user is authenticated
- Redirects to `/access-login` if not authenticated
- Uses dependency injection with `inject()`

#### 3. **AccessLoginComponent** (`access-login/`)
Login form UI with validation.

**Features:**
- Reactive Forms with validation
- Real-time error messages
- Loading state during authentication
- Demo credentials display
- Responsive design with Tailwind-compatible styling

#### 4. **AuthConfig** (`config/auth.config.ts`)
Centralized credential storage.

```typescript
const AUTH_CONFIG = {
  validUsername: 'client',
  validPassword: 'client@123',
  storageLockKey: 'kbc_access_granted'
};
```

---

## How It Works

### 1. User Visits Application

```
User visits /
  ↓
authGuard checks authentication
  ↓
Not authenticated?
  ↓
Redirect to /access-login
```

### 2. Login Flow

```
User enters credentials
  ↓
FormGroup validates (required, minLength)
  ↓
User clicks "Access Application"
  ↓
AuthService.authenticate() called
  ↓
Credentials match?
  ├─ YES: Set localStorage flag + emit Observable
  │       Redirect to /
  │
  └─ NO: Show error message, reset form
```

### 3. Authenticated State

```
isAuthenticated = true (from localStorage)
  ↓
All protected routes accessible
  ↓
Logout button visible in app header
```

### 4. Logout Flow

```
User clicks Logout button
  ↓
AuthService.logout() called
  ↓
Clear localStorage flag + emit Observable
  ↓
Redirect to /access-login
```

---

## Route Configuration

### Protected Routes

All main application routes are protected with `canActivate: [authGuard]`:

```typescript
export const routes: Routes = [
  // Unprotected
  { path: 'access-login', component: AccessLoginComponent },

  // Protected
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'welcome', component: WelcomePageComponent, canActivate: [authGuard] },
  { path: 'contestents-list', component: ContestentsListComponent, canActivate: [authGuard] },
  { path: 'quiz', component: QuizComponent, canActivate: [authGuard] },
  { path: 'quiz/:id', component: QuizComponent, canActivate: [authGuard] },

  { path: '**', redirectTo: '' }
];
```

---

## Demo Credentials

| Field    | Value        |
|----------|--------------|
| Username | `client`     |
| Password | `client@123` |

These credentials are displayed on the login page for ease of testing.

---

## Features

### ✅ Implemented

- [x] Simple username/password authentication
- [x] Route guards on all protected routes
- [x] Reactive Forms with validation
- [x] localStorage persistence (survives page refresh)
- [x] Logout functionality
- [x] Error messaging
- [x] Loading states
- [x] Responsive UI
- [x] Unit tests for AuthService and AccessLoginComponent
- [x] TypeScript strict mode compatible

### ✗ Deliberately Not Included

- ❌ Backend authentication
- ❌ Password hashing/encryption
- ❌ Token-based auth (JWT)
- ❌ Session management
- ❌ Password reset
- ❌ User registration

---

## Usage Examples

### Using AuthService in Components

```typescript
import { AuthService } from './auth/services/auth.service';

export class MyComponent {
  isAuthenticated$ = this.authService.isAuthenticated$;

  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
```

### Template Usage

```html
<!-- Show content only if authenticated -->
<div *ngIf="isAuthenticated$ | async">
  Authenticated user only
</div>

<!-- Logout button example (in AppComponent) -->
<button *ngIf="isAuthenticated$ | async" (click)="logout()">
  Logout
</button>
```

### Protecting a Route

Routes are already protected in `app.routes.ts`. The guard automatically redirects unauthenticated users:

```typescript
{ 
  path: 'protected-page', 
  component: ProtectedComponent, 
  canActivate: [authGuard] 
}
```

---

## Testing

### Run Tests

```bash
npm test
```

### Test Coverage

- **AuthService**: 7 test cases covering authentication, logout, persistence
- **AccessLoginComponent**: 6 test cases covering form validation, login flow, error handling

### Example Test

```typescript
it('should authenticate with valid credentials', () => {
  const result = service.authenticate('client', 'client@123');
  expect(result).toBe(true);
  expect(service.getIsAuthenticated()).toBe(true);
});
```

---

## Styling & UX

### Login Page Design

- **Gradient background**: Purple to deep purple (`#667eea` to `#764ba2`)
- **Card-based layout**: Clean, centered form
- **Real-time validation**: Error messages appear on blur
- **Loading state**: Button feedback during authentication
- **Demo credentials**: Transparent display for testing
- **Responsive**: Works on mobile, tablet, desktop

### Logout Button

- **Position**: Fixed top-right corner
- **Style**: Red/danger color with hover effects
- **Icon**: Power symbol (⏚)
- **Mobile-friendly**: Reduced padding on small screens

---

## Security Considerations

⚠️ **This is NOT secure for production use**. It's designed for:
- Client-delivered demos
- Internal access restriction only
- Preventing accidental public discovery

### Limitations

1. **Plaintext credentials**: Visible in source code and browser DevTools
2. **No encryption**: localStorage stores flag, not encrypted data
3. **Client-side only**: No backend validation
4. **No session timeout**: Access persists until logout or localStorage clear
5. **No rate limiting**: Unlimited login attempts

### Recommendations for Production

- Implement backend authentication
- Use OAuth or OAuth2
- Hash passwords securely
- Implement session management
- Add rate limiting
- Use HTTPS only
- Implement CSRF protection
- Use secure HTTP-only cookies

---

## Customization

### Change Credentials

Edit [src/app/auth/config/auth.config.ts](src/app/auth/config/auth.config.ts):

```typescript
export const AUTH_CONFIG = {
  validUsername: 'your-username',
  validPassword: 'your-password',
  storageLockKey: 'your-storage-key'
};
```

### Change Login Page Styling

Edit [src/app/auth/pages/access-login/access-login.component.css](src/app/auth/pages/access-login/access-login.component.css)

### Modify Validation Rules

Edit AccessLoginComponent's `initializeForm()`:

```typescript
private initializeForm(): void {
  this.loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
}
```

---

## Troubleshooting

### "Redirected to /access-login" on every route

**Cause**: AuthGuard is checking for authentication but service isn't initialized
**Fix**: Ensure AuthService is provided in root: `providedIn: 'root'` (already done)

### Logout button not showing

**Cause**: isAuthenticated$ observable not emitting
**Fix**: Check that AuthService.authenticate() is called with correct credentials

### localStorage not persisting

**Cause**: Private browsing or localStorage disabled
**Fix**: Browser must allow localStorage; test in normal mode

### Styling not applied

**Cause**: CSS file not linked properly
**Fix**: Verify component.css is linked in `styleUrl` and Angular is compiling

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Maintenance

### Updating Credentials

Simply edit `auth.config.ts` and restart the application. No re-compilation needed in development.

### Adding New Protected Routes

Add to `app.routes.ts`:

```typescript
{
  path: 'new-route',
  component: NewComponent,
  canActivate: [authGuard]
}
```

### Extending Authentication Logic

Modify `auth.service.ts` methods as needed. The Observable pattern ensures all subscribers receive updates.

---

## Performance Impact

- **Bundle size**: ~2KB additional gzipped
- **Runtime**: Minimal (localStorage checks, Observable subscriptions)
- **Rendering**: Login page uses standard Angular patterns (no external dependencies)

---

## License & Credits

Part of the KBC-WEB application authentication system.

**Built with**:
- Angular 19+
- RxJS for reactive state management
- Angular Reactive Forms
- TypeScript strict mode

---

## Questions?

Refer to component comments for specific implementation details. All code includes JSDoc-style documentation.
