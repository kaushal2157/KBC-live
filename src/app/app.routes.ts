import { Routes } from '@angular/router';
import { QuizComponent } from './pages/quiz/quiz.component';
import { HomeComponent } from './pages/home/home.component';
import { ContestentsListComponent } from './pages/contestents-list/contestents-list.component';
import { WelcomePageComponent } from './pages/welcome-page/welcome-page.component';

export const routes: Routes = [
     { path: '', component: HomeComponent },
     {path:'welcome',component:WelcomePageComponent},
     {path:'contestents-list',component:ContestentsListComponent},
     { path: 'quiz', component: QuizComponent },
     { path: 'quiz/:id', component: QuizComponent },
];
