import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { QuestionsService } from '../../services/questions.service';
import { ActivatedRoute } from '@angular/router';
import { routes } from '../../app.routes';
import { NEVER } from 'rxjs';
import { RoleContextService } from '../../services/role-context.service';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  explanation?: string;
}

interface GameState {
  currentQuestion: number;
  score: number;
  gameOver: boolean;
  gameWon: boolean;
  usedLifelines: {
    fiftyFifty: boolean;
    audiencePoll: boolean;
    phoneAFriend: boolean;
  };
  showExplanation: boolean;
  timeLeft: number;
  timerActive: boolean;
}

@Component({
  selector: 'app-quiz',
  imports: [CommonModule],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css',
})
export class QuizComponent {
  questionsService = inject(QuestionsService);
  roleContextService = inject(RoleContextService);
  branding = this.roleContextService.getBrandingConfig();
  isTigerTheme = this.roleContextService.getCurrentRole() === 'tiger';
  questions: string | any = [];

  gameState: GameState = {
    currentQuestion: 0,
    score: 0,
    gameOver: false,
    gameWon: false,
    usedLifelines: {
      fiftyFifty: false,
      audiencePoll: false,
      phoneAFriend: false,
    },
    showExplanation: false,
    timeLeft: 60,
    timerActive: false,
  };

  gameStarted = false;
  selectedAnswer: number | null = null;
  showCorrectAnswer = false;
  hiddenOptions: number[] = [];
  showAudiencePoll = false;
  audiencePollResults: number[] = [];
  phoneAFriendMessage = '';
  lifelineMessage = '';
  timerInterval: any;
  //sounds
  timerSound = new Audio('1-min-timer.mp3');
  lifelineSound = new Audio('lifeline.mp3');
  clappingSound = new Audio('clapping.mp3');
  wrongAnsSound = new Audio('hooter.mp3');

  // Expose Math for template
  Math = Math;
  String = String;

  showOptions: boolean = false;
  timerStarted: boolean = false;
  routerService = inject(ActivatedRoute);
  contestentId: any = 1;
  ngOnInit() {
    const idParam = this.routerService.snapshot.paramMap.get('id');
    this.contestentId = Number(idParam)
    this.questionsService
      .getContestantById(this.contestentId)
      .subscribe((data) => {
        this.questions = data!.questions;
        console.log('questions : ', this.questions);
        // this.shuffleQuestions();
      });

    this.startGame();
    // this.gameStarted = true;
    // this.gameState.gameOver = false;
    // this.gameState.gameWon = false;
  }

  shuffleQuestions() {
    this.questions = this.questions.sort(() => Math.random() - 0.5);
  }

  startGame() {
    this.gameStarted = true;
    this.gameState.currentQuestion = 0;
    this.selectedAnswer = null;

    this.resetQuestionState();
  }

  resetGame() {
    this.gameStarted = false;
    this.stopTimer();
    this.resetGameState();
    this.shuffleQuestions();
    this.startGame();
  }

  resetGameState() {
    this.gameState = {
      currentQuestion: 0,
      score: 0,
      gameOver: false,
      gameWon: false,
      usedLifelines: {
        fiftyFifty: false,
        audiencePoll: false,
        phoneAFriend: false,
      },
      showExplanation: false,
      timeLeft: 60,
      timerActive: false,
    };
    this.selectedAnswer = null;
    this.showCorrectAnswer = false;
    this.hiddenOptions = [];
    this.showAudiencePoll = false;
    this.phoneAFriendMessage = '';
    this.lifelineMessage = '';
  }

  startTimer() {
    if (this.timerStarted) return;

    this.timerStarted = true;
    this.gameState.timerActive = true;
    this.timerSound.play();

    this.timerInterval = setInterval(() => {
      if (this.gameState.timeLeft > 0) {
        this.gameState.timeLeft--;
      } else {
        clearInterval(this.timerInterval);
        this.nextQuestion();
      }
    }, 1000);
  }

  pauseAndResumeTimer() {
    console.log('gamestate pause ');
    
    if (this.gameState.timerActive) {
      // ⏸ Pause

      this.gameState.timerActive = false;
      this.timerSound.pause();
      clearInterval(this.timerInterval);
    } else {
      // ▶️ Resume
      this.gameState.timerActive = true;

      // Resume sound from where it stopped
      this.timerSound.play();

      // Resume countdown
      this.timerInterval = setInterval(() => {
        if (this.gameState.timeLeft > 0) {
          this.gameState.timeLeft--;
        } else {
          // timer finished
          this.gameState.gameOver = true;
          this.stopTimer();
        }
      }, 1000);
    }
  }

  stopTimer() {
    this.gameState.timerActive = false;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.timerSound.pause();
    this.timerSound.currentTime = 0; // reset
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  getCurrentQuestion(): Question | undefined {
    return this.questions[this.gameState.currentQuestion];
  }

  selectAnswer(optionIndex: number) {
    if (this.selectedAnswer !== null) return;

    this.selectedAnswer = optionIndex;
    this.showCorrectAnswer = true;
    this.gameState.showExplanation = true;
    this.stopTimer();

    const currentQuestion = this.getCurrentQuestion();
    if (currentQuestion && optionIndex === currentQuestion.correctAnswer) {
      this.clappingSound.play();
      this.gameState.score++;
    } else {
      // Wrong answer - game over after a short delay
      this.wrongAnsSound.play();
      setTimeout(() => {
        this.gameState.gameOver = true;
      }, 2000);
    }
  }

  nextQuestion() {
    this.selectedAnswer = null;
    this.gameState.currentQuestion++;
    this.hiddenOptions = [];
    this.wrongAnsSound.pause();
    this.clappingSound.pause();

    if (this.gameState.currentQuestion >= this.questions.length) {
      this.gameState.gameWon = true;
      return;
    }

    this.resetQuestionState();
  }
  resetQuestionState() {
    this.showOptions = false;
    this.timerStarted = false;
    this.gameState.timeLeft = 60;

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
  onShowOptions() {
    this.showOptions = true;
    this.startTimer();
  }

  // Lifeline: 50-50
  useFiftyFifty() {
    if (this.gameState.usedLifelines.fiftyFifty || this.selectedAnswer !== null)
      return;
    this.lifelineSound.play(); //sound
    this.gameState.usedLifelines.fiftyFifty = true;
    const correctAnswer = this.getCurrentQuestion()?.correctAnswer || 0;
    const incorrectOptions = [0, 1, 2, 3].filter((i) => i !== correctAnswer);

    // Hide 2 random incorrect options
    this.hiddenOptions = incorrectOptions
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    this.showLifelineMessage('50-50 used! Two wrong answers removed.');
  }

  // Lifeline: Audience Poll
  useAudiencePoll() {
    if (
      this.gameState.usedLifelines.audiencePoll ||
      this.selectedAnswer !== null
    )
      return;

    this.lifelineSound.play(); //sound
    this.gameState.usedLifelines.audiencePoll = true;
    const correctAnswer = this.getCurrentQuestion()?.correctAnswer || 0;

    // Generate realistic poll results (correct answer gets higher percentage)
    this.audiencePollResults = [0, 0, 0, 0];
    let remaining = 100;

    // Give correct answer 40-70% of votes
    this.audiencePollResults[correctAnswer] =
      Math.floor(Math.random() * 31) + 40;
    remaining -= this.audiencePollResults[correctAnswer];

    // Distribute remaining votes among other options
    for (let i = 0; i < 4; i++) {
      if (i !== correctAnswer) {
        if (remaining > 0) {
          const votes = Math.floor(Math.random() * Math.min(remaining, 25));
          this.audiencePollResults[i] = votes;
          remaining -= votes;
        }
      }
    }

    // Add any remaining votes to a random option
    if (remaining > 0) {
      const randomIndex = Math.floor(Math.random() * 4);
      this.audiencePollResults[randomIndex] += remaining;
    }

    this.showAudiencePoll = true;
    this.showLifelineMessage('Audience poll completed!');
  }

  // Lifeline: Phone a Friend
  usePhoneAFriend() {
    if (
      this.gameState.usedLifelines.phoneAFriend ||
      this.selectedAnswer !== null
    )
      return;

    this.lifelineSound.play(); //sound
    this.gameState.usedLifelines.phoneAFriend = true;
    const correctAnswer = this.getCurrentQuestion()?.correctAnswer || 0;
    const correctLetter = String.fromCharCode(65 + correctAnswer);

    const friendMessages = [
      `I think the answer is ${correctLetter}. I'm pretty confident about this one!`,
      `Hmm, I'm not 100% sure, but I'd go with option ${correctLetter}.`,
      `Based on what I remember, ${correctLetter} sounds right to me.`,
      `I studied this recently, and I believe it's ${correctLetter}.`,
      `My gut feeling says ${correctLetter}. Hope that helps!`,
    ];

    this.phoneAFriendMessage =
      friendMessages[Math.floor(Math.random() * friendMessages.length)];
    this.showLifelineMessage('Phone a Friend used!');
  }

  showLifelineMessage(message: string) {
    this.lifelineMessage = message;
    setTimeout(() => {
      this.lifelineMessage = '';
    }, 3000);
  }

  getOptionClass(index: number): string {
    if (this.hiddenOptions.includes(index)) {
      return 'opacity-30 cursor-not-allowed scale-95';
    }

    if (this.selectedAnswer === null) {
      return 'cursor-pointer hover:shadow-xl hover:scale-102 hover:-translate-y-1';
    }

    return 'cursor-not-allowed';
  }

  getOptionInnerClass(index: number): string {
    const currentQuestion = this.getCurrentQuestion();
    if (!currentQuestion)
      return 'bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-600';

    if (this.selectedAnswer === null) {
      return 'bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-600 group-hover:from-slate-700 group-hover:to-slate-800 group-hover:border-yellow-500/50';
    }

    if (index === currentQuestion.correctAnswer) {
      return 'bg-gradient-to-r from-emerald-700 to-emerald-800 border border-emerald-500 animate-pulse';
    }

    if (
      index === this.selectedAnswer &&
      index !== currentQuestion.correctAnswer
    ) {
      return 'bg-gradient-to-r from-red-700 to-red-800 border border-red-500';
    }

    return 'bg-gradient-to-r from-slate-700 to-slate-800 border border-slate-600';
  }

  getOptionLabelClass(index: number): string {
    const currentQuestion = this.getCurrentQuestion();
    if (!currentQuestion)
      return 'text-yellow-500 bg-yellow-500/20 border border-yellow-500/30';

    if (this.selectedAnswer === null) {
      return 'text-yellow-500 bg-yellow-500/20 border border-yellow-500/30 group-hover:bg-yellow-500/30 group-hover:text-yellow-400';
    }

    if (index === currentQuestion.correctAnswer) {
      return 'text-emerald-400 bg-emerald-500/20 border border-emerald-500/50';
    }

    if (
      index === this.selectedAnswer &&
      index !== currentQuestion.correctAnswer
    ) {
      return 'text-red-400 bg-red-500/20 border border-red-500/50';
    }

    return 'text-gray-500 bg-gray-500/20 border border-gray-500/30';
  }

  getOptionTextClass(index: number): string {
    const currentQuestion = this.getCurrentQuestion();
    if (!currentQuestion) return 'text-gray-200 group-hover:text-white';

    if (this.selectedAnswer === null) {
      return 'text-gray-200 group-hover:text-white';
    }

    if (index === currentQuestion.correctAnswer) {
      return 'text-emerald-200 font-semibold';
    }

    if (
      index === this.selectedAnswer &&
      index !== currentQuestion.correctAnswer
    ) {
      return 'text-red-200';
    }

    return 'text-gray-400';
  }
}
