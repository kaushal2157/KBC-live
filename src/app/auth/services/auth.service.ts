import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AUTH_CONFIG } from '../config/auth.config';

/**
 * Authentication Service
 * Manages access control state and localStorage persistence.
 * This is basic access protection, not full authentication.
 */
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
