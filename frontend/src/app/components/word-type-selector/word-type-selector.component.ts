import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, WordType } from '../../services/api.service';

@Component({
  selector: 'app-word-type-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './word-type-selector.component.html',
  styleUrl: './word-type-selector.component.css',
})
export class WordTypeSelectorComponent implements OnInit {
  @Output() typeSelected = new EventEmitter<WordType>();

  types: WordType[] = [];
  selectedId: number | null = null;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getWordTypes().subscribe((types) => (this.types = types));
  }

  select(type: WordType) {
    this.selectedId = type.id;
    this.typeSelected.emit(type);
  }
}