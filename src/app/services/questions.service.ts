import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {

  constructor(private http: HttpClient) { }

  getQuestions(): Observable<any> {
    return this.http.get<any>('questions.json'); // ✅ no leading slash
  }
  testMethod() {
    console.log('QuestionsService is loaded!');
}
}
