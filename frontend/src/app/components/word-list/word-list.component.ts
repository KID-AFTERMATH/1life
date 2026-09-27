import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApiService, Word, WordType } from '../../services/api.service';
import { SentenceStateService } from '../../services/sentence-state.service';

@Component({
  selector: 'app-word-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './word-list.component.html',
  styleUrl: './word-list.component.css',
})
export class WordListComponent implements OnChanges {
  @Input() type: WordType | null = null;

  words: Word[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private api: ApiService,
    private state: SentenceStateService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['type'] && this.type) {
      this.loadWords(this.type.id);
    }
  }

  private loadWords(typeId: number): void {
    this.loading = true;
    this.error = null;
    this.words = [];

    this.api.getWords(typeId).subscribe({
      next: (words) => {
        this.words = words;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      },
    });
  }

  add(word: Word): void {
    if (!this.type) return;
    this.state.addWord({
      id: word.id,
      value: word.value,
      typeName: this.type.name,
    });
  }
}
