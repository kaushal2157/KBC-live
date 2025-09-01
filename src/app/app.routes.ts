import { Routes } from '@angular/router';
import { QuizComponent } from './pages/quiz/quiz.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
     { path: '', component: HomeComponent },
     { path: 'quiz', component: QuizComponent },
];
