import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SentenceStateService, SelectedWord } from '../../services/sentence-state.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-sentence-builder',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sentence-builder.component.html',
  styleUrl: './sentence-builder.component.css',
})
export class SentenceBuilderComponent implements OnInit {
  words: SelectedWord[] = [];
  editingId: number | null = null;
  statusMessage = '';

  constructor(
    private state: SentenceStateService,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.state.words$.subscribe((w) => (this.words = w));
    this.state.editingId$.subscribe((id) => (this.editingId = id));
  }

  remove(index: number) {
    this.state.removeAt(index);
  }

  clear() {
    this.state.clear();
    this.statusMessage = '';
  }

  get preview(): string {
    return this.words.map((w) => w.value).join(' ');
  }

  save() {
    const text = this.preview.trim();
    if (!text) return;

    if (this.editingId != null) {
      this.api.updateSentence(this.editingId, text).subscribe(() => {
        this.statusMessage = 'Sentence updated!';
        this.state.clear();
      });
    } else {
      this.api.createSentence(text).subscribe(() => {
        this.statusMessage = 'Sentence saved!';
        this.state.clear();
      });
    }
  }
}