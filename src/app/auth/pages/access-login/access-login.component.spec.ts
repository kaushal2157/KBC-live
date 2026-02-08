import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AccessLoginComponent } from './access-login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

describe('AccessLoginComponent', () => {
  let component: AccessLoginComponent;
  let fixture: ComponentFixture<AccessLoginComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['authenticate']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [AccessLoginComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AccessLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.loginForm).toBeTruthy();
    expect(component.loginForm.get('username')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should have invalid form when empty', () => {
    component.loginForm.patchValue({ username: '', password: '' });
    expect(component.loginForm.invalid).toBe(true);
  });

  it('should have valid form with correct values', () => {
    component.loginForm.patchValue({
      username: 'client',
      password: 'client@123'
    });
    expect(component.loginForm.valid).toBe(true);
  });

  it('should call authenticate on login', fakeAsync(() => {
    mockAuthService.authenticate.and.returnValue(true);
    component.loginForm.patchValue({
      username: 'client',
      password: 'client@123'
    });

    component.onLogin();
    tick(350);

    expect(mockAuthService.authenticate).toHaveBeenCalledWith('client', 'client@123');
  }));

  it('should navigate to home on successful login', fakeAsync(() => {
    mockAuthService.authenticate.and.returnValue(true);
    component.loginForm.patchValue({
      username: 'client',
      password: 'client@123'
    });

    component.onLogin();
    tick(350);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  }));
});
