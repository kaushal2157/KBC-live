import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { QuestionsService } from '../../services/questions.service';
import { Contestant } from '../../models/contestent.model';
import { RoleContextService } from '../../services/role-context.service';
import { RoleBrandingConfig } from '../../services/role-branding.config';

@Component({
  selector: 'app-contestents-list',
  imports: [CommonModule],
  templateUrl: './contestents-list.component.html',
  styleUrl: './contestents-list.component.css'
})
export class ContestentsListComponent {
  
  contestants: Contestant[] = [];
  branding!: RoleBrandingConfig;
  isTigerTheme = false;
  // contestants = Array.from({ length: 15 }).map((_, i) => ({
  //   id: i + 1,
  //   name: `Contestant ${i + 1}`,
  //   totalQuestions: 10
  // }));

  constructor(
    private router: Router,
    private questionService: QuestionsService,
    private roleContextService: RoleContextService
  ) {
    this.branding = this.roleContextService.getBrandingConfig();
    this.isTigerTheme = this.roleContextService.getCurrentRole() === 'tiger';
  }

  ngOnInit(): void {
    this.questionService.getContestants().subscribe(data => {
    this.contestants = data;
    console.log('data : ', this.contestants);
    
  });
  }

  selectContestant(contestant: any) {
    this.router.navigate(['/quiz', contestant.id]);
  }

}
