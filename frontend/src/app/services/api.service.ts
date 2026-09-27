import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
  private readonly base = environment.apiBase;

  constructor(private http: HttpClient) {}

  getWordTypes(): Observable<WordType[]> {
    return this.http
      .get<WordType[]>(`${this.base}/word-types`)
      .pipe(catchError(this.handleError));
  }

  getWords(typeId: number): Observable<Word[]> {
    return this.http
      .get<Word[]>(`${this.base}/words`, { params: { typeId } })
      .pipe(catchError(this.handleError));
  }

  getSentences(): Observable<Sentence[]> {
    return this.http
      .get<Sentence[]>(`${this.base}/sentences`)
      .pipe(catchError(this.handleError));
  }

  getSentence(id: number): Observable<Sentence> {
    return this.http
      .get<Sentence>(`${this.base}/sentences/${id}`)
      .pipe(catchError(this.handleError));
  }

  createSentence(content: string): Observable<Sentence> {
    return this.http
      .post<Sentence>(`${this.base}/sentences`, { content })
      .pipe(catchError(this.handleError));
  }

  updateSentence(id: number, content: string): Observable<Sentence> {
    return this.http
      .put<Sentence>(`${this.base}/sentences/${id}`, { content })
      .pipe(catchError(this.handleError));
  }

  deleteSentence(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.base}/sentences/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(err: HttpErrorResponse) {
    const message =
      err.error && typeof err.error === 'object' && 'error' in err.error
        ? String((err.error as { error: unknown }).error)
        : err.message || 'Network error';
    console.error('[ApiService]', message, err);
    return throwError(() => new Error(message));
  }
}
