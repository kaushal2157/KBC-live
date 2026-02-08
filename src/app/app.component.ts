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
