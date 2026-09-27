import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface SelectedWord {
  id: number;
  value: string;
  typeName: string;
}

/**
 * Holds the sentence currently being built (or edited).
 * Shared between the word list, the builder, and the saved-list
 * component so they stay in sync without prop drilling.
 */
@Injectable({ providedIn: 'root' })
export class SentenceStateService {
  private readonly wordsSubject = new BehaviorSubject<SelectedWord[]>([]);
  private readonly editingIdSubject = new BehaviorSubject<number | null>(null);

  readonly words$: Observable<SelectedWord[]> = this.wordsSubject.asObservable();
  readonly editingId$: Observable<number | null> =
    this.editingIdSubject.asObservable();

  get words(): SelectedWord[] {
    return this.wordsSubject.value;
  }

  get editingId(): number | null {
    return this.editingIdSubject.value;
  }

  addWord(word: SelectedWord): void {
    this.wordsSubject.next([...this.wordsSubject.value, word]);
  }

  removeAt(index: number): void {
    const next = [...this.wordsSubject.value];
    if (index >= 0 && index < next.length) {
      next.splice(index, 1);
      this.wordsSubject.next(next);
    }
  }

  clear(): void {
    this.wordsSubject.next([]);
    this.editingIdSubject.next(null);
  }

  /**
   * Loads an existing sentence into the builder.
   * The raw text is split into pseudo-words so the user can still
   * remove or reorder them.
   */
  startEditing(id: number, sentenceText: string): void {
    const pseudoWords: SelectedWord[] = sentenceText
      .split(/\s+/)
      .filter((token) => token.length > 0)
      .map((value, index) => ({
        id: -1 - index, // negative ids mark pseudo-words
        value,
        typeName: 'Edited',
      }));

    this.wordsSubject.next(pseudoWords);
    this.editingIdSubject.next(id);
  }

  get currentText(): string {
    return this.wordsSubject.value.map((w) => w.value).join(' ');
  }
}
