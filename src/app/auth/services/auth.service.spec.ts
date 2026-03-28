import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { AUTH_CONFIG } from '../config/auth.config';
import { RoleContextService } from '../../services/role-context.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    localStorage.clear();
    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with unauthenticated state', (done) => {
    service.isAuthenticated$.subscribe((isAuth) => {
      expect(isAuth).toBe(false);
      done();
    });
  });

  it('should authenticate with valid credentials', () => {
    const pravaktaCredential = AUTH_CONFIG.credentials[0];
    const result = service.authenticate(
      pravaktaCredential.username,
      pravaktaCredential.password
    );

    expect(result).toBe(true);
    expect(service.getIsAuthenticated()).toBe(true);
    expect(localStorage.getItem(AUTH_CONFIG.storageLockKey)).toBe('true');
  });

  it('should fail authentication with invalid credentials', () => {
    const result = service.authenticate('wrong', 'wrong');

    expect(result).toBe(false);
    expect(service.getIsAuthenticated()).toBe(false);
  });

  it('should persist authentication state in localStorage', () => {
    const pravaktaCredential = AUTH_CONFIG.credentials[0];
    service.authenticate(pravaktaCredential.username, pravaktaCredential.password);
    expect(localStorage.getItem(AUTH_CONFIG.storageLockKey)).toBe('true');
  });

  it('should logout and clear authentication', () => {
    const pravaktaCredential = AUTH_CONFIG.credentials[0];
    service.authenticate(pravaktaCredential.username, pravaktaCredential.password);
    service.logout();

    expect(service.getIsAuthenticated()).toBe(false);
    expect(localStorage.getItem(AUTH_CONFIG.storageLockKey)).toBeNull();
  });

  it('should restore authentication state from localStorage on instantiation', () => {
    localStorage.setItem(AUTH_CONFIG.storageLockKey, 'true');
    const roleContextService = TestBed.inject(RoleContextService);
    const newService = new AuthService(roleContextService);

    expect(newService.getIsAuthenticated()).toBe(true);
  });

  it('should emit authentication state changes via observable', (done) => {
    const states: boolean[] = [];

    service.isAuthenticated$.subscribe((isAuth) => {
      states.push(isAuth);

      if (states.length === 2) {
        expect(states).toEqual([false, true]);
        done();
      }
    });

    const pravaktaCredential = AUTH_CONFIG.credentials[0];
    service.authenticate(pravaktaCredential.username, pravaktaCredential.password);
  });
});
