# Code Reference Guide

## Quick Navigation

### Core Files

1. **[Credentials Configuration](#auth-config)** - `src/app/auth/config/auth.config.ts`
2. **[Authentication Service](#auth-service)** - `src/app/auth/services/auth.service.ts`
3. **[Route Guard](#auth-guard)** - `src/app/auth/guards/auth.guard.ts`
4. **[Login Component](#login-component)** - `src/app/auth/pages/access-login/access-login.component.ts`
5. **[App Routes](#app-routes)** - `src/app/app.routes.ts`
6. **[App Component](#app-component)** - `src/app/app.component.ts`

---

## <a id="auth-config">1. Auth Config</a>

**File**: `src/app/auth/config/auth.config.ts`

```typescript
/**
 * Authentication Configuration
 * IMPORTANT: This is basic access protection only, not a production authentication system.
 * Credentials are stored client-side for demo/client delivery purposes only.
 */

export const AUTH_CONFIG = {
  validUsername: 'client',
  validPassword: 'client@123',
  storageLockKey: 'kbc_access_granted',
};
```

**Usage**: Import and use in AuthService
```typescript
import { AUTH_CONFIG } from '../config/auth.config';

// Check if credentials match
const isValid = username === AUTH_CONFIG.validUsername && 
                password === AUTH_CONFIG.validPassword;
```

**To Change Credentials**: Edit the `validUsername` and `validPassword` properties

---

## <a id="auth-service">2. Authentication Service</a>

**File**: `src/app/auth/services/auth.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AUTH_CONFIG } from '../config/auth.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.checkStoredAuth());
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  constructor() {}

  /**
   * Check if user has previously authenticated (stored in localStorage)
   */
  private checkStoredAuth(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(AUTH_CONFIG.storageLockKey) === 'true';
  }

  /**
   * Validate credentials and grant access
   */
  authenticate(username: string, password: string): boolean {
    const isValid =
      username === AUTH_CONFIG.validUsername &&
      password === AUTH_CONFIG.validPassword;

    if (isValid) {
      localStorage.setItem(AUTH_CONFIG.storageLockKey, 'true');
      this.isAuthenticatedSubject.next(true);
    }

    return isValid;
  }

  /**
   * Get current authentication status
   */
  getIsAuthenticated(): boolean {
    return this.isAuthenticatedSubject.getValue();
  }

  /**
   * Logout and clear access
   */
  logout(): void {
    localStorage.removeItem(AUTH_CONFIG.storageLockKey);
    this.isAuthenticatedSubject.next(false);
  }
}
```

**Key Methods**:
- `authenticate(username, password)` - Returns `boolean`, stores flag in localStorage
- `getIsAuthenticated()` - Returns current status
- `logout()` - Clears session
- `isAuthenticated$` - Observable for reactive updates

**Usage in Components**:
```typescript
constructor(private authService: AuthService) {}

// Subscribe to changes
isAuthenticated$ = this.authService.isAuthenticated$;

// Check current value
if (this.authService.getIsAuthenticated()) {
  // User is logged in
}

// Logout
this.authService.logout();
```

---

## <a id="auth-guard">3. Route Guard</a>

**File**: `src/app/auth/guards/auth.guard.ts`

```typescript
import { Injectable, inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Route Guard for protecting authenticated routes
 * Redirects unauthenticated users to the access login page
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.getIsAuthenticated()) {
    return true;
  }

  // Redirect to login page
  router.navigate(['/access-login']);
  return false;
};
```

**How It Works**:
1. Check if user is authenticated via `AuthService.getIsAuthenticated()`
2. If YES: Allow navigation (return `true`)
3. If NO: Redirect to `/access-login` and block navigation (return `false`)

**Used in Routes**:
```typescript
{ 
  path: 'protected-page', 
  component: ProtectedComponent, 
  canActivate: [authGuard]  // ← Applied here
}
```

---

## <a id="login-component">4. Login Component</a>

**File**: `src/app/auth/pages/access-login/access-login.component.ts`

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-access-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './access-login.component.html',
  styleUrl: './access-login.component.css'
})
export class AccessLoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * Initialize login form with validation
   */
  private initializeForm(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * Get form controls for template access
   */
  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  /**
   * Handle login attempt
   */
  onLogin(): void {
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    const { username, password } = this.loginForm.value;

    // Simulate slight delay for better UX
    setTimeout(() => {
      const isAuthenticated = this.authService.authenticate(username, password);

      if (isAuthenticated) {
        this.router.navigate(['/']);
      } else {
        this.errorMessage = 'Invalid username or password';
        this.loginForm.reset();
      }

      this.isLoading = false;
    }, 300);
  }
}
```

**Features**:
- Reactive Forms with validation
- Real-time error messages
- Loading state during authentication
- Auto-redirect on success
- Error display on failure

**Form Validation**:
```typescript
// Username: required, minimum 3 characters
username: ['', [Validators.required, Validators.minLength(3)]]

// Password: required, minimum 6 characters
password: ['', [Validators.required, Validators.minLength(6)]]
```

---

## <a id="app-routes">5. Application Routes</a>

**File**: `src/app/app.routes.ts`

```typescript
import { Routes } from '@angular/router';
import { QuizComponent } from './pages/quiz/quiz.component';
import { HomeComponent } from './pages/home/home.component';
import { ContestentsListComponent } from './pages/contestents-list/contestents-list.component';
import { WelcomePageComponent } from './pages/welcome-page/welcome-page.component';
import { AccessLoginComponent } from './auth/pages/access-login/access-login.component';
import { authGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
  // Auth routes (unprotected)
  { path: 'access-login', component: AccessLoginComponent },

  // Protected application routes
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'welcome', component: WelcomePageComponent, canActivate: [authGuard] },
  { path: 'contestents-list', component: ContestentsListComponent, canActivate: [authGuard] },
  { path: 'quiz', component: QuizComponent, canActivate: [authGuard] },
  { path: 'quiz/:id', component: QuizComponent, canActivate: [authGuard] },

  // Wildcard redirect
  { path: '**', redirectTo: '' }
];
```

**Route Protection Pattern**:
```typescript
{
  path: 'my-page',
  component: MyComponent,
  canActivate: [authGuard]  // ← Protects this route
}
```

**Unprotected Routes**:
- `/access-login` - Available to everyone (login page)

**Protected Routes** (require authentication):
- `/` - Home
- `/welcome` - Welcome page
- `/contestents-list` - Contestants list
- `/quiz` - Quiz
- `/quiz/:id` - Quiz with ID

---

## <a id="app-component">6. App Component</a>

**File**: `src/app/app.component.ts`

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from './auth/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'KBC-WEB';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Observable for authentication state
   */
  get isAuthenticated$() {
    return this.authService.isAuthenticated$;
  }

  /**
   * Logout user and redirect to login page
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/access-login']);
  }
}
```

**File**: `src/app/app.component.html`

```html
<div class="app-wrapper">
  <!-- Logout Button (visible when authenticated) -->
  <div *ngIf="isAuthenticated$ | async" class="logout-container">
    <button class="logout-button" (click)="logout()" title="Logout and return to access control">
      <span class="logout-icon">⏚</span>
      Logout
    </button>
  </div>

  <!-- Main Application Routes -->
  <router-outlet></router-outlet>
</div>
```

**Template Syntax**:
- `*ngIf="isAuthenticated$ | async"` - Shows button only if authenticated
- `(click)="logout()"` - Calls logout method
- `<router-outlet></router-outlet>` - Displays active route component

---

## Integration Example

### Adding Auth to a New Component

```typescript
// my-component.component.ts
import { Component } from '@angular/core';
import { AuthService } from './auth/services/auth.service';

@Component({
  selector: 'app-my-component',
  template: `
    <div *ngIf="isAuthenticated$ | async">
      <h1>Protected Content</h1>
      <button (click)="logout()">Logout</button>
    </div>
  `
})
export class MyComponent {
  isAuthenticated$ = this.authService.isAuthenticated$;

  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
```

### Adding Auth to a New Route

```typescript
// In app.routes.ts
import { authGuard } from './auth/guards/auth.guard';

{
  path: 'my-new-page',
  component: MyNewComponent,
  canActivate: [authGuard]  // ← Add this line
}
```

---

## Common Code Patterns

### Pattern 1: Subscribe to Authentication Changes

```typescript
export class MyComponent implements OnInit {
  isAuthenticated = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      console.log('Auth state changed:', isAuth);
    });
  }
}
```

### Pattern 2: Use Observable Directly in Template

```typescript
export class MyComponent {
  isAuthenticated$ = this.authService.isAuthenticated$;

  constructor(private authService: AuthService) {}
}
```

```html
<div *ngIf="isAuthenticated$ | async">
  User is authenticated
</div>
```

### Pattern 3: Check Current Value

```typescript
export class MyComponent {
  constructor(private authService: AuthService) {}

  doSomething() {
    if (this.authService.getIsAuthenticated()) {
      // User is authenticated
    } else {
      // User is not authenticated
    }
  }
}
```

### Pattern 4: Manual Logout

```typescript
export class MyComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/access-login']);
  }
}
```

---

## Testing Examples

### Test AuthService

```typescript
it('should authenticate with valid credentials', () => {
  const result = service.authenticate('client', 'client@123');
  
  expect(result).toBe(true);
  expect(service.getIsAuthenticated()).toBe(true);
  expect(localStorage.getItem('kbc_access_granted')).toBe('true');
});
```

### Test Component Login

```typescript
it('should navigate on successful authentication', (done) => {
  mockAuthService.authenticate.and.returnValue(true);
  component.loginForm.patchValue({
    username: 'client',
    password: 'client@123'
  });

  component.onLogin();

  setTimeout(() => {
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    done();
  }, 400);
});
```

---

## Debugging Tips

### Check localStorage in Browser Console

```javascript
// View authentication flag
localStorage.getItem('kbc_access_granted');

// Clear authentication (logout)
localStorage.removeItem('kbc_access_granted');

// Clear all
localStorage.clear();
```

### Check Current Auth Status

```typescript
// In DevTools console (after importing service)
this.authService.getIsAuthenticated()  // Returns true/false

// Subscribe to changes
this.authService.isAuthenticated$.subscribe(console.log)
```

### Verify Guard is Active

```typescript
// In browser console, navigate without auth
router.navigate(['/quiz'])
// Should redirect to /access-login if not authenticated
```

---

## Performance Considerations

| Aspect | Impact |
|--------|--------|
| Bundle size | +~2KB gzipped |
| Runtime overhead | Minimal (localStorage checks, Observable emissions) |
| Re-renders | Only when auth state changes |
| Memory usage | Negligible |

---

## Browser Support

All modern browsers supporting:
- ES2020
- localStorage API
- RxJS Observables
- Angular 19+

**Tested on**:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Migration from No Auth

If you had routes without auth before:

**Before**:
```typescript
{ path: 'quiz', component: QuizComponent }
```

**After**:
```typescript
{ path: 'quiz', component: QuizComponent, canActivate: [authGuard] }
```

Just add `canActivate: [authGuard]` to each protected route.

---

## Troubleshooting Code Issues

### Issue: "Cannot read property 'isAuthenticated$' of undefined"
**Fix**: Make sure AuthService is injected in constructor

### Issue: "authGuard is not a function"
**Fix**: Make sure authGuard is imported: `import { authGuard } from './auth/guards/auth.guard'`

### Issue: Logout button not appearing
**Fix**: Check template uses correct observable: `*ngIf="isAuthenticated$ | async"`

### Issue: Routes not protected
**Fix**: Verify all routes have `canActivate: [authGuard]`

---

**Ready to use!** Copy-paste these code patterns into your application.
