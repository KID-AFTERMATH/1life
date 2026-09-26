import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface SelectedWord {
  id: number;
  value: string;
  typeName: string;
}

@Injectable({ providedIn: 'root' })
export class SentenceStateService {
  // Currently building sentence — array of selected words in order.
  private wordsSubject = new BehaviorSubject<SelectedWord[]>([]);
  words$ = this.wordsSubject.asObservable();

  // If editing an existing sentence, this holds its id.
  private editingIdSubject = new BehaviorSubject<number | null>(null);
  editingId$ = this.editingIdSubject.asObservable();

  addWord(word: SelectedWord) {
    this.wordsSubject.next([...this.wordsSubject.value, word]);
  }

  removeAt(index: number) {
    const next = [...this.wordsSubject.value];
    next.splice(index, 1);
    this.wordsSubject.next(next);
  }

  clear() {
    this.wordsSubject.next([]);
    this.editingIdSubject.next(null);
  }

  startEditing(id: number, sentenceText: string) {
    // We only know the text, so we make "pseudo-words" — user can still edit.
    const words = sentenceText.split(/\s+/).map((value, i) => ({
      id: -i - 1, // negative to mark as pseudo
      value,
      typeName: 'Edited',
    }));
    this.wordsSubject.next(words);
    this.editingIdSubject.next(id);
  }

  get currentText(): string {
    return this.wordsSubject.value.map((w) => w.value).join(' ');
  }
}