import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

import { ApiService, Sentence } from '../../services/api.service';
import { SentenceStateService } from '../../services/sentence-state.service';

@Component({
  selector: 'app-saved-sentences',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './saved-sentences.component.html',
  styleUrl: './saved-sentences.component.css',
})
export class SavedSentencesComponent implements OnInit, OnDestroy {
  sentences: Sentence[] = [];
  loading = false;
  error: string | null = null;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private api: ApiService,
    private state: SentenceStateService,
  ) {}

  ngOnInit(): void {
    this.refresh();

    // Refresh whenever the shared words stream emits (covers save+clear).
    this.state.words$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.refresh());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  refresh(): void {
    this.loading = true;
    this.error = null;

    this.api.getSentences().subscribe({
      next: (sentences) => {
        this.sentences = sentences;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      },
    });
  }

  edit(sentence: Sentence): void {
    this.state.startEditing(sentence.id, sentence.content);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  remove(sentence: Sentence): void {
    if (!confirm('Delete this sentence?')) return;

    this.api.deleteSentence(sentence.id).subscribe({
      next: () => this.refresh(),
      error: (err) => (this.error = err.message),
    });
  }
}
