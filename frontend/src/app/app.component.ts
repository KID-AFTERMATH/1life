import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordTypeSelectorComponent } from './components/word-type-selector/word-type-selector.component';
import { WordListComponent } from './components/word-list/word-list.component';
import { SentenceBuilderComponent } from './components/sentence-builder/sentence-builder.component';
import { SavedSentencesComponent } from './components/saved-sentences/saved-sentences.component';
import { WordType } from './services/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    WordTypeSelectorComponent,
    WordListComponent,
    SentenceBuilderComponent,
    SavedSentencesComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  selectedType: WordType | null = null;

  onTypeSelected(t: WordType) {
    this.selectedType = t;
  }
}