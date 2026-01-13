import { Question } from './question.model';

export interface Contestant {
  id: number;
  name: string;
  questions: Question[];
}
