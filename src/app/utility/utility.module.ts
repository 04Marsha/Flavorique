import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpinnerComponent } from './spinner/spinner.component';
import { PaginatorComponent } from './paginator/paginator.component';

@NgModule({
  declarations: [SpinnerComponent, PaginatorComponent],
  imports: [CommonModule],
  exports: [SpinnerComponent, PaginatorComponent],
})
export class UtilityModule {}
