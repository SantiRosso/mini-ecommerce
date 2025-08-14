import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FavoriteListComponent } from './favorite-list/favorite-list.component';
import { FavoriteButtonComponent } from './favorite-button/favorite-button.component';
import { FavoriteService } from './favorite.service';

@NgModule({
  declarations: [
    FavoriteListComponent,
    FavoriteButtonComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  providers: [
    FavoriteService
  ],
  exports: [
    FavoriteListComponent,
    FavoriteButtonComponent
  ]
})
export class FavoriteModule {}
