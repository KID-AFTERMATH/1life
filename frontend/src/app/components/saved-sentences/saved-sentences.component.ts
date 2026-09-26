import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Sentence } from '../../services/api.service';
import { SentenceStateService } from '../../services/sentence-state.service';

@Component({
  selector: 'app-saved-sentences',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './saved-sentences.component.html',
  styleUrl: './saved-sentences.component.css',
})
export class SavedSentencesComponent implements OnInit {
  sentences: Sentence[] = [];

  constructor(
    private api: ApiService,
    private state: SentenceStateService
  ) {}

  ngOnInit(): void {
    this.refresh();
    // Whenever a save/clear happens, refresh the list.
    this.state.words$.subscribe(() => this.refresh());
  }

  refresh() {
    this.api.getSentences().subscribe((s) => (this.sentences = s));
  }

  edit(s: Sentence) {
    this.state.startEditing(s.id, s.content);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}