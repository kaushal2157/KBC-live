import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RoleBrandingConfig } from '../services/role-branding.config';

@Component({
  selector: 'app-quiz-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-result.component.html',
  styleUrl: './quiz-result.component.css'
})
export class QuizResultComponent {
  @Input() branding!: RoleBrandingConfig;
  @Input() isTigerTheme = false;
  @Input() score = 0;
  @Input() totalQuestions = 0;
  @Input() gameWon = false;
  @Input() gameOver = false;

  @Output() retry = new EventEmitter<void>();
  @Output() gotoContestants = new EventEmitter<void>();

  get percentage(): number {
    return this.totalQuestions
      ? Math.round((this.score / this.totalQuestions) * 100)
      : 0;
  }

  get outcomeTitle(): string {
    if (this.gameWon) {
      return 'Magnificent Victory!';
    }
    if (this.percentage >= 80) {
      return 'Outstanding Performance!';
    }
    if (this.percentage >= 50) {
      return 'Great Effort!';
    }
    return 'Better Luck Next Time!';
  }

  get outcomeMessage(): string {
    if (this.gameWon) {
      return `You've demonstrated exceptional brilliance! A perfect finish for ${this.branding.organizationName}. You are a true champion!`;
    }
    if (this.percentage >= 80) {
      return `Phenomenal! You scored ${this.percentage}% and showcased an impressive depth of knowledge.`;
    }
    if (this.percentage >= 50) {
      return `Solid work! You achieved ${this.percentage}%. Keep pushing, you're on the right track!`;
    }
    return `Don't give up! Review your mistakes and head back to the arena. Every setback is a setup for a comeback!`;
  }

  get statusLabel(): string {
    return this.gameWon ? 'Champion' : 'Finished';
  }

  get badgeClass(): string {
    if (this.gameWon) {
      return 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30';
    }
    if (this.percentage >= 80) {
      return 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30';
    }
    if (this.percentage >= 50) {
      return 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/30';
    }
    return 'bg-rose-500/20 text-rose-300 border border-rose-400/30';
  }

  get accentGradient(): string {
    return this.isTigerTheme
      ? 'from-amber-500 via-orange-500 to-rose-600'
      : 'from-sky-500 via-indigo-500 to-fuchsia-600';
  }
}

