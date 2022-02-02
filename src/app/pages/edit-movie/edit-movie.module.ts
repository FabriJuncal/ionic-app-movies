import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditMoviePageRoutingModule } from './edit-movie-routing.module';

import { EditMoviePage } from './edit-movie.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditMoviePageRoutingModule
  ],
  declarations: [EditMoviePage]
})
export class EditMoviePageModule {}
