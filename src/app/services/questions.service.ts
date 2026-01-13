import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Contestant } from '../models/contestent.model';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {

  private dataUrl = 'questions.json';

  constructor(private http: HttpClient) {}

  getContestants(): Observable<Contestant[]> {
    return this.http.get<any>(this.dataUrl).pipe(
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
