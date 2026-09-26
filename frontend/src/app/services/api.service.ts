import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface WordType {
  id: number;
  name: string;
}

export interface Word {
  id: number;
  value: string;
  type_id: number;
}

export interface Sentence {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = environment.apiBase;

  constructor(private http: HttpClient) {}

  getWordTypes(): Observable<WordType[]> {
    return this.http.get<WordType[]>(`${this.base}/word-types`);
  }

  getWords(typeId: number): Observable<Word[]> {
    return this.http.get<Word[]>(`${this.base}/words?typeId=${typeId}`);
  }

  getSentences(): Observable<Sentence[]> {
    return this.http.get<Sentence[]>(`${this.base}/sentences`);
  }

  getSentence(id: number): Observable<Sentence> {
    return this.http.get<Sentence>(`${this.base}/sentences/${id}`);
  }

  createSentence(content: string): Observable<Sentence> {
    return this.http.post<Sentence>(`${this.base}/sentences`, { content });
  }

  updateSentence(id: number, content: string): Observable<Sentence> {
    return this.http.put<Sentence>(`${this.base}/sentences/${id}`, { content });
  }
}