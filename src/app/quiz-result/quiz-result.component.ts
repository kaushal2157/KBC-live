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
      return 'Quiz completed with flying colors';
    }
    if (this.percentage >= 80) {
      return 'Outstanding finish';
    }
    if (this.percentage >= 50) {
      return 'Great effort';
    }
    return 'Nice try - keep going';
  }

  get outcomeMessage(): string {
    if (this.gameWon) {
      return `You answered all ${this.totalQuestions} questions and earned a perfect finish for ${this.branding.organizationName}.`;
    }
    if (this.percentage >= 80) {
      return `Excellent work - you scored ${this.percentage}% and showed strong knowledge.`;
    }
    if (this.percentage >= 50) {
      return `Good result! You scored ${this.percentage}% and you're ready for the next round.`;
    }
    return `This round is complete. Review your score and head back to the contestants list to try again.`;
  }

  get statusLabel(): string {
    return this.gameWon ? 'Champion' : 'Finished';
  }

  get badgeClass(): string {
    if (this.gameWon) {
      return 'bg-emerald-500/20 text-emerald-100 border border-emerald-400/25';
    }
    if (this.percentage >= 80) {
      return 'bg-cyan-500/20 text-cyan-100 border border-cyan-400/25';
    }
    if (this.percentage >= 50) {
      return 'bg-indigo-500/20 text-indigo-100 border border-indigo-400/25';
    }
    return 'bg-rose-500/20 text-rose-100 border border-rose-400/25';
  }

  get accentGradient(): string {
    return this.isTigerTheme
      ? 'from-amber-500 via-orange-500 to-rose-600'
      : 'from-sky-500 via-indigo-500 to-fuchsia-600';
  }
}
