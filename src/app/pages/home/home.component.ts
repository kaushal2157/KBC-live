import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { QuizComponent } from '../quiz/quiz.component';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  router = inject(Router);
  startQuiz() {
    console.log("Starting quiz...");
    this.router.navigate(['quiz']);
  }
}
