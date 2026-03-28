import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AUTH_CONFIG } from '../config/auth.config';
import { RoleContextService } from '../../services/role-context.service';

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

  constructor(private roleContextService: RoleContextService) {}

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
    const normalizedUsername = username?.trim().toLowerCase();
    const normalizedPassword = password?.trim();
    const matchedCredential = AUTH_CONFIG.credentials.find(
      credential =>
        credential.username.toLowerCase() === normalizedUsername &&
        credential.password === normalizedPassword
    );
    const isValid = Boolean(matchedCredential);

    if (matchedCredential) {
      localStorage.setItem(AUTH_CONFIG.storageLockKey, 'true');
      this.roleContextService.setRole(matchedCredential.role);
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
    this.roleContextService.clearRole();
    this.isAuthenticatedSubject.next(false);
  }
}
