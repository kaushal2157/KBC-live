import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AUTH_CONFIG, UserRole } from '../auth/config/auth.config';
import { ROLE_BRANDING_CONFIG, RoleBrandingConfig } from './role-branding.config';

@Injectable({
  providedIn: 'root'
})
export class RoleContextService {
  private readonly roleSubject = new BehaviorSubject<UserRole>(this.getInitialRole());
  readonly role$: Observable<UserRole> = this.roleSubject.asObservable();

  private getInitialRole(): UserRole {
    if (typeof window === 'undefined') {
      return AUTH_CONFIG.defaultRole;
    }

    const storedRole = localStorage.getItem(AUTH_CONFIG.roleStorageKey) as UserRole | null;
    if (storedRole && Object.prototype.hasOwnProperty.call(ROLE_BRANDING_CONFIG, storedRole)) {
      return storedRole;
    }

    return AUTH_CONFIG.defaultRole;
  }

  setRole(role: UserRole): void {
    this.roleSubject.next(role);
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_CONFIG.roleStorageKey, role);
    }
  }

  clearRole(): void {
    this.roleSubject.next(AUTH_CONFIG.defaultRole);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_CONFIG.roleStorageKey);
    }
  }

  getCurrentRole(): UserRole {
    return this.roleSubject.getValue();
  }

  getBrandingConfig(): RoleBrandingConfig {
    return ROLE_BRANDING_CONFIG[this.getCurrentRole()];
  }
}
