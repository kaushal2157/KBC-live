import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome-page',
  imports: [],
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.css'
})
export class WelcomePageComponent {

    router = inject(Router);
  startQuiz() {
    console.log("Starting quiz...");
    this.router.navigate(['contestents-list']);
  }
}
