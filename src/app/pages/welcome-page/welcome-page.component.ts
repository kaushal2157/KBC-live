import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RoleContextService } from '../../services/role-context.service';

@Component({
  selector: 'app-welcome-page',
  imports: [],
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.css'
})
export class WelcomePageComponent {
  router = inject(Router);
  roleContextService = inject(RoleContextService);
  branding = this.roleContextService.getBrandingConfig();
  isTigerTheme = this.roleContextService.getCurrentRole() === 'tiger';

  startQuiz() {
    console.log("Starting quiz...");
    this.router.navigate(['contestents-list']);
  }
}
