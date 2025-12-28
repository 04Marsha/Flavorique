import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PostListComponent } from './post-list/post-list.component';
import { PostCreateComponent } from './post-create/post-create.component';
import { PostDisplayComponent } from './post-display/post-display.component';
import { UtilityModule } from '../utility/utility.module';
import { FooterComponent } from '../footer/footer.component';

@NgModule({
  declarations: [PostListComponent, PostCreateComponent, PostDisplayComponent, FooterComponent],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    UtilityModule,
  ],
})
export class PostsModule {}
