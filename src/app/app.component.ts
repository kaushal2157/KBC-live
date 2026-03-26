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
  fabOpen = false;
  showLogoutModal = false;

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
   * Toggle the floating action button menu
   */
  toggleFab(): void {
    this.fabOpen = !this.fabOpen;
  }

  /**
   * Navigate to a specific route
   */
  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.fabOpen = false; // Close the FAB menu after navigation
  }

  /**
   * Show logout confirmation modal
   */
  showLogoutConfirm(): void {
    this.showLogoutModal = true;
    this.fabOpen = false; // Close the FAB menu
  }

  /**
   * Close logout confirmation modal
   */
  closeLogoutModal(): void {
    this.showLogoutModal = false;
  }

  /**
   * Confirm logout and redirect to login page
   */
  confirmLogout(): void {
    this.authService.logout();
    this.router.navigate(['/access-login']);
    this.showLogoutModal = false;
  }
}
