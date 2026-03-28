import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Contestant } from '../models/contestent.model';
import { RoleContextService } from './role-context.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {
  constructor(private http: HttpClient, private roleContextService: RoleContextService) {}

  getContestants(): Observable<Contestant[]> {
    const dataUrl = this.roleContextService.getBrandingConfig().questionsFile;
    return this.http.get<any>(dataUrl).pipe(
      map(data => data.contestants)
    );
  }

  getContestantById(id: number): Observable<Contestant | undefined> {
    return this.getContestants().pipe(
      map(contestants => contestants.find(c => c.id === id))
    );
  }
  testMethod() {
    console.log('QuestionsService is loaded!');
}
}
