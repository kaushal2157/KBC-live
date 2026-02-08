import { Routes } from '@angular/router';
import { QuizComponent } from './pages/quiz/quiz.component';
import { HomeComponent } from './pages/home/home.component';
import { ContestentsListComponent } from './pages/contestents-list/contestents-list.component';
import { WelcomePageComponent } from './pages/welcome-page/welcome-page.component';
import { AccessLoginComponent } from './auth/pages/access-login/access-login.component';
import { authGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
  // Auth routes (unprotected)
  { path: 'access-login', component: AccessLoginComponent },

  // Protected application routes
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'welcome', component: WelcomePageComponent, canActivate: [authGuard] },
  { path: 'contestents-list', component: ContestentsListComponent, canActivate: [authGuard] },
  { path: 'quiz', component: QuizComponent, canActivate: [authGuard] },
  { path: 'quiz/:id', component: QuizComponent, canActivate: [authGuard] },

  // Wildcard redirect
  { path: '**', redirectTo: '' }
];
