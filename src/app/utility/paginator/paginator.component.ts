import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-paginator',
  standalone: false,
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.css',
})
export class PaginatorComponent implements OnChanges {
  @Input() totalPosts = 0;
  @Input() postsPerPage = 8;
  @Input() currentPage = 1;
  @Output() pageChange = new EventEmitter<number>();

  pages: number[] = [];

  ngOnChanges() {
    this.updatePages();
  }

  private updatePages() {
    if (this.totalPosts <= 0 || this.postsPerPage <= 0) {
      this.pages = [];
      return;
    }
    const totalPages = Math.ceil(this.totalPosts / this.postsPerPage);
    this.pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  onPageChange(page: number) {
    if (page < 1 || page > this.pages.length) {
      return;
    }
    this.currentPage = page;
    this.pageChange.emit(page);
  }
}
