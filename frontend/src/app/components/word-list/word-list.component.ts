import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
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

  constructor(
    private api: ApiService,
    private state: SentenceStateService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['type'] && this.type) {
      this.api.getWords(this.type.id).subscribe((w) => (this.words = w));
    }
  }

  add(word: Word) {
    if (!this.type) return;
    this.state.addWord({
      id: word.id,
      value: word.value,
      typeName: this.type.name,
    });
  }
}