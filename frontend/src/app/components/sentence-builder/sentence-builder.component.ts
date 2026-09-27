import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

import {
  SelectedWord,
  SentenceStateService,
} from '../../services/sentence-state.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-sentence-builder',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sentence-builder.component.html',
  styleUrl: './sentence-builder.component.css',
})
export class SentenceBuilderComponent implements OnInit, OnDestroy {
  words: SelectedWord[] = [];
  editingId: number | null = null;
  statusMessage = '';
  errorMessage = '';
  saving = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private state: SentenceStateService,
    private api: ApiService,
  ) {}

  ngOnInit(): void {
    this.state.words$
      .pipe(takeUntil(this.destroy$))
      .subscribe((words) => (this.words = words));

    this.state.editingId$
      .pipe(takeUntil(this.destroy$))
      .subscribe((id) => (this.editingId = id));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get preview(): string {
    return this.words.map((w) => w.value).join(' ');
  }

  remove(index: number): void {
    this.state.removeAt(index);
  }

  clear(): void {
    this.state.clear();
    this.statusMessage = '';
    this.errorMessage = '';
  }

  save(): void {
    const text = this.preview.trim();
    if (!text) {
      this.errorMessage = 'Cannot save an empty sentence.';
      return;
    }

    this.saving = true;
    this.statusMessage = '';
    this.errorMessage = '';

    const request$ =
      this.editingId != null
        ? this.api.updateSentence(this.editingId, text)
        : this.api.createSentence(text);

    request$.subscribe({
      next: () => {
        this.statusMessage =
          this.editingId != null ? 'Sentence updated.' : 'Sentence saved.';
        this.state.clear();
        this.saving = false;
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.saving = false;
      },
    });
  }
}
