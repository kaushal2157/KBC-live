import { Routes } from '@angular/router';
import { QuizComponent } from './pages/quiz/quiz.component';
import { HomeComponent } from './pages/home/home.component';
import { ContestentsListComponent } from './pages/contestents-list/contestents-list.component';

export const routes: Routes = [
     { path: '', component: HomeComponent },
     {path:'contestents-list',component:ContestentsListComponent},
     { path: 'quiz', component: QuizComponent },
];
