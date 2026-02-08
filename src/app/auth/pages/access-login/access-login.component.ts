import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

/**
 * Access Login Component
 * Provides a simple username/password login form for access control.
 */
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
