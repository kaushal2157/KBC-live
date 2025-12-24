import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contestents-list',
  imports: [CommonModule],
  templateUrl: './contestents-list.component.html',
  styleUrl: './contestents-list.component.css'
})
export class ContestentsListComponent {

  contestants = Array.from({ length: 15 }).map((_, i) => ({
    id: i + 1,
    name: `Contestant ${i + 1}`,
    totalQuestions: 10
  }));

  constructor(private router: Router) {}

  ngOnInit(): void {}

  selectContestant(contestant: any) {
    this.router.navigate(['/quiz', contestant.id]);
  }

}
