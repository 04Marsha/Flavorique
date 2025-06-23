import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-post-display',
  standalone: false,
  templateUrl: './post-display.component.html',
  styleUrls: ['post-display.component.css'],
})
export class PostDisplayComponent {
    @Input() image: string;
    @Input() recipeName: string;
    @Input() name: string;
    @Input() recipe: string;
    @Output() close = new EventEmitter<void>();

    onClose() {
    this.close.emit();
  }
}
